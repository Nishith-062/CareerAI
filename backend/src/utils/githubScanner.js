import axios from "axios";
import { normalizeSkillName } from "./skillNormalizer.js";
import dotenv from "dotenv";
dotenv.config();

// ─── Config ─────────────────────────────────────────────────
const GITHUB_API = "https://api.github.com";
const HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};
const CONCURRENCY_LIMIT = 5; // max parallel requests to avoid rate limits

// ─── Helpers ────────────────────────────────────────────────

/**
 * Process an array in batches to avoid rate-limiting.
 * Runs `fn` on each item, `limit` items at a time.
 */
async function batchProcess(items, fn, limit = CONCURRENCY_LIMIT) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

/**
 * Fetch a file's content from a GitHub repo.
 * Returns parsed JSON content, or null if not found.
 */
async function fetchRepoFile(username, repoName, filePath) {
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${username}/${repoName}/contents/${filePath}`,
      { headers: HEADERS },
    );
    const content = Buffer.from(response.data.content, "base64").toString(
      "utf8",
    );
    return JSON.parse(content);
  } catch {
    return null; // 404 or parse error — file doesn't exist
  }
}

// ─── Dependency → Skill Mapping ─────────────────────────────
// Maps common npm package names to the skill they represent.
// normalizeSkillName handles final canonicalization.
const DEPENDENCY_SKILL_MAP = {
  // Frameworks & Libraries
  react: "React",
  "react-dom": "React",
  "react-router-dom": "React",
  next: "Next.js",
  vue: "Vue.js",
  nuxt: "Nuxt.js",
  angular: "Angular",
  "@angular/core": "Angular",
  svelte: "Svelte",
  express: "Express",
  fastify: "Node.js",
  koa: "Node.js",
  hapi: "Node.js",
  nestjs: "Node.js",
  "@nestjs/core": "Node.js",

  // Databases & ORMs
  mongoose: "MongoDB",
  mongodb: "MongoDB",
  pg: "SQL",
  mysql2: "SQL",
  mysql: "SQL",
  sequelize: "SQL",
  prisma: "SQL",
  "@prisma/client": "SQL",
  redis: "Redis",
  ioredis: "Redis",

  // State Management
  redux: "State Management",
  "@reduxjs/toolkit": "State Management",
  zustand: "State Management",
  mobx: "State Management",
  recoil: "State Management",

  // Styling
  tailwindcss: "Tailwind CSS",
  "styled-components": "CSS-in-JS",
  sass: "CSS",
  bootstrap: "Bootstrap",

  // Testing
  jest: "Testing",
  mocha: "Testing",
  chai: "Testing",
  cypress: "Testing",
  "@testing-library/react": "Testing",
  vitest: "Testing",

  // Auth & Security
  jsonwebtoken: "Authentication & Security",
  bcryptjs: "Authentication & Security",
  bcrypt: "Authentication & Security",
  passport: "Authentication & Security",

  // Cloud & DevOps
  "aws-sdk": "Cloud Platforms",
  "@aws-sdk/client-s3": "Cloud Platforms",
  firebase: "Firebase",
  "firebase-admin": "Firebase",

  // GraphQL
  graphql: "GraphQL",
  "apollo-server": "GraphQL",
  "@apollo/client": "GraphQL",

  // Utilities
  axios: "REST APIs",
  "socket.io": "WebSockets",
  "socket.io-client": "WebSockets",
  typescript: "TypeScript",
  webpack: "Build Tools",
  vite: "Build Tools",
  docker: "Docker",
};

/**
 * Extract skill names from a package.json's dependencies.
 */
function extractSkillsFromPackageJson(packageJson) {
  if (!packageJson) return [];

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const skills = new Set();
  for (const dep of Object.keys(allDeps)) {
    const skill = DEPENDENCY_SKILL_MAP[dep];
    if (skill) {
      skills.add(skill);
    }
  }
  return [...skills];
}

// ─── Scoring Constants ──────────────────────────────────────
const SCORES = {
  SINGLE_REPO: 0.1, // language appears in only 1 repo
  MULTI_REPO: 0.3, // language appears in 2+ repos
  RECENT_ACTIVITY_BONUS: 0.2, // repo updated within last 90 days
  PACKAGE_JSON_BONUS: 0.2, // skill detected via package.json deps
};

const RECENT_ACTIVITY_DAYS = 90;

// ─── Main Scanner ───────────────────────────────────────────

const verifySkillsWithGithub = async (username) => {
  try {
    // ── Step 1: Fetch user's public repos (sorted by most recently pushed) ──
    const repoResponse = await axios.get(
      `${GITHUB_API}/users/${username}/repos`,
      {
        params: { sort: "pushed", direction: "desc", per_page: 30 },
        headers: HEADERS,
      },
    );

    const repos = repoResponse.data;

    // ── Step 2: Fetch languages for all repos in parallel batches ──
    const languageResults = await batchProcess(repos, async (repo) => {
      const response = await axios.get(
        `${GITHUB_API}/repos/${username}/${repo.name}/languages`,
        { headers: HEADERS },
      );
      return {
        repoName: repo.name,
        pushedAt: repo.pushed_at,
        languages: response.data,
      };
    });

    // ── Step 3: Count how many repos each language appears in ──
    // and track which languages have recent activity
    const languageRepoCounts = new Map(); // language → number of repos
    const recentLanguages = new Set(); // languages with recent commits
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RECENT_ACTIVITY_DAYS);

    for (const result of languageResults) {
      if (result.status !== "fulfilled") continue;
      const { pushedAt, languages } = result.value;
      const isRecent = new Date(pushedAt) > cutoffDate;

      for (const language of Object.keys(languages)) {
        languageRepoCounts.set(
          language,
          (languageRepoCounts.get(language) || 0) + 1,
        );
        if (isRecent) {
          recentLanguages.add(language);
        }
      }
    }

    // ── Step 4: Build initial scores from language data ──
    const skillScores = new Map(); // normalizedSkill → score

    for (const [language, count] of languageRepoCounts.entries()) {
      const normalized = normalizeSkillName(language);
      const baseScore = count > 1 ? SCORES.MULTI_REPO : SCORES.SINGLE_REPO;
      const recentBonus = recentLanguages.has(language)
        ? SCORES.RECENT_ACTIVITY_BONUS
        : 0;
      const total = baseScore + recentBonus;

      // Keep the highest score if multiple raw languages normalize to the same skill
      const existing = skillScores.get(normalized) || 0;
      skillScores.set(normalized, Math.max(existing, Number(total.toFixed(2))));
    }

    // ── Step 5: Scan package.json files for framework/library detection ──
    const packageJsonPaths = [
      "package.json",
      "frontend/package.json",
      "backend/package.json",
    ];

    const packageJsonResults = await batchProcess(repos, async (repo) => {
      const allSkills = new Set();
      for (const filePath of packageJsonPaths) {
        const pkgJson = await fetchRepoFile(username, repo.name, filePath);
        const skills = extractSkillsFromPackageJson(pkgJson);
        skills.forEach((s) => allSkills.add(s));
      }
      return { repoName: repo.name, skills: [...allSkills] };
    });

    // Boost scores for skills found in package.json
    for (const result of packageJsonResults) {
      if (result.status !== "fulfilled") continue;
      for (const skill of result.value.skills) {
        const normalized = normalizeSkillName(skill);
        const current = skillScores.get(normalized) || 0;
        const boosted = Number(
          (current + SCORES.PACKAGE_JSON_BONUS).toFixed(2),
        );
        skillScores.set(normalized, Math.min(boosted, 1.0)); // cap at 1.0
      }
    }

    // ── Step 6: Convert to JSON and return ──
    const resultObject = Object.fromEntries(skillScores);
    const json = JSON.stringify(resultObject);
    console.log("GitHub verification results:", json);

    return json;
  } catch (error) {
    console.error("GitHub Scanner Error:", error.message);
    return "{}";
  }
};

export default verifySkillsWithGithub;
