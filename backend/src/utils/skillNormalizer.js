// ============================================================
// Skill Normalizer — The Canonical Naming Engine
// ============================================================
// Problem: "React JS", "React.js", "ReactJS", "React" are all
// the same skill, but string comparison says they're different.
//
// This module converts messy, human-written skill names into
// standard canonical names BEFORE any gap comparison happens.
// ============================================================

// ─── STEP 1: Alias Map ─────────────────────────────────────
// Maps every known variation → one canonical name.
// The canonical name MUST match what's used in roleSkills.js.
// ────────────────────────────────────────────────────────────

const SKILL_ALIASES = {
  // ── JavaScript ──
  javascript: "JavaScript",
  js: "JavaScript",
  "java script": "JavaScript",
  es6: "JavaScript",
  es2015: "JavaScript",
  ecmascript: "JavaScript",
  "vanilla js": "JavaScript",
  "vanilla javascript": "JavaScript",

  // ── React ──
  react: "React JS",
  "react js": "React JS",
  "react.js": "React JS",
  reactjs: "React JS",
  "react js": "React JS",

  // ── Node.js ──
  node: "Node.js",
  "node.js": "Node.js",
  nodejs: "Node.js",
  "node js": "Node.js",

  // ── Express ──
  express: "Express",
  "express.js": "Express",
  expressjs: "Express",
  "express js": "Express",

  // ── MongoDB ──
  mongodb: "MongoDB",
  mongo: "MongoDB",
  "mongo db": "MongoDB",
  mongoose: "MongoDB",

  // ── Python ──
  python: "Python",
  python3: "Python",
  "python 3": "Python",
  py: "Python",

  // ── SQL / Databases ──
  sql: "SQL",
  mysql: "SQL",
  postgresql: "SQL",
  postgres: "SQL",
  sqlite: "SQL",
  databases: "Databases",
  database: "Databases",
  db: "Databases",
  rdbms: "Databases",

  // ── HTML/CSS ──
  html: "HTML/CSS",
  css: "HTML/CSS",
  "html/css": "HTML/CSS",
  "html css": "HTML/CSS",
  html5: "HTML/CSS",
  css3: "HTML/CSS",
  "html5/css3": "HTML/CSS",

  // ── TypeScript ──
  typescript: "TypeScript",
  ts: "TypeScript",
  "type script": "TypeScript",

  // ── Docker ──
  docker: "Docker",
  "docker container": "Docker",
  "docker containers": "Docker",
  containerization: "Docker",

  // ── Kubernetes ──
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  kube: "Kubernetes",

  // ── CI/CD ──
  "ci/cd": "CI/CD",
  cicd: "CI/CD",
  "ci cd": "CI/CD",
  "continuous integration": "CI/CD",
  "continuous deployment": "CI/CD",
  jenkins: "CI/CD",
  "github actions": "CI/CD",
  "gitlab ci": "CI/CD",

  // ── Git ──
  git: "Git",
  github: "Git",
  gitlab: "Git",
  "version control": "Git",

  // ── Testing ──
  testing: "Testing",
  "unit testing": "Testing",
  test: "Testing",
  jest: "Testing",
  mocha: "Testing",
  "testing (jest/rtl)": "Testing (Jest/RTL)",

  // ── State Management ──
  redux: "State Management",
  zustand: "State Management",
  mobx: "State Management",
  "state management": "State Management",
  "context api": "State Management",

  // ── Machine Learning ──
  "machine learning": "Machine Learning",
  ml: "Machine Learning",
  "scikit-learn": "Machine Learning",
  sklearn: "Machine Learning",

  // ── Deep Learning ──
  "deep learning": "Deep Learning",
  dl: "Deep Learning",
  tensorflow: "Deep Learning",
  pytorch: "Deep Learning",
  keras: "Deep Learning",
  "neural networks": "Deep Learning",

  // ── System Design ──
  "system design": "System Design",
  "system architecture": "System Design",
  "software architecture": "System Design",
  hld: "System Design",
  lld: "System Design",

  // ── REST APIs ──
  "rest api": "REST APIs",
  "rest apis": "REST APIs",
  restful: "REST APIs",
  "restful api": "REST APIs",
  "api development": "REST APIs",
  "api design": "REST APIs",

  // ── Cloud ──
  aws: "Cloud Platforms",
  gcp: "Cloud Platforms",
  azure: "Cloud Platforms",
  cloud: "Cloud Platforms",
  "cloud computing": "Cloud Platforms",
  "cloud platforms": "Cloud Platforms",
  "aws / azure / gcp": "Cloud Platforms",
  "cloud (aws/gcp/azure)": "Cloud Platforms",

  // ── Linux ──
  linux: "Linux",
  ubuntu: "Linux",
  unix: "Linux",
  bash: "Linux",
  "shell scripting": "Linux",

  // ── Redis / Caching ──
  redis: "Caching (Redis)",
  caching: "Caching (Redis)",
  "caching (redis)": "Caching (Redis)",
  memcached: "Caching (Redis)",

  // ── React Native / Flutter ──
  "react native": "React Native / Flutter",
  flutter: "React Native / Flutter",
  "react native / flutter": "React Native / Flutter",

  // ── Dart ──
  dart: "JavaScript / Dart",
  "javascript / dart": "JavaScript / Dart",

  // ── Statistics ──
  statistics: "Statistics",
  stats: "Statistics",
  probability: "Statistics",
  "statistical analysis": "Statistics",

  // ── Data Visualization ──
  "data visualization": "Data Visualization",
  tableau: "Data Visualization",
  "power bi": "Data Visualization",
  matplotlib: "Data Visualization",
  d3: "Data Visualization",
  "d3.js": "Data Visualization",

  // ── Spark ──
  spark: "Spark",
  "apache spark": "Spark",
  pyspark: "Spark",

  // ── Airflow ──
  airflow: "Airflow",
  "apache airflow": "Airflow",

  // ── Security ──
  "authentication & security": "Authentication & Security",
  auth: "Authentication & Security",
  jwt: "Authentication & Security",
  oauth: "Authentication & Security",

  // ── Networking ──
  networking: "Networking",
  "tcp/ip": "Networking",
  dns: "Networking",
  "network security": "Network Security",

  // ── Agile / Scrum ──
  agile: "Agile/Scrum",
  scrum: "Agile/Scrum",
  "agile/scrum": "Agile/Scrum",
  kanban: "Agile/Scrum",

  // ── Figma / Design ──
  figma: "Figma / Design Tools",
  "figma / design tools": "Figma / Design Tools",
  sketch: "Figma / Design Tools",
  "adobe xd": "Figma / Design Tools",

  // ── Selenium / Cypress ──
  selenium: "Selenium / Cypress",
  cypress: "Selenium / Cypress",
  playwright: "Selenium / Cypress",
  "selenium / cypress": "Selenium / Cypress",

  // ── API Testing ──
  "api testing": "API Testing",
  postman: "API Testing",

  // ── Responsive Design ──
  "responsive design": "Responsive Design",
  "responsive web design": "Responsive Design",
  "media queries": "Responsive Design",
  "mobile first": "Responsive Design",

  // ── Web Performance ──
  "web performance": "Web Performance",
  "performance optimization": "Web Performance",
  lighthouse: "Web Performance",

  // ── ETL ──
  etl: "ETL Pipelines",
  "etl pipelines": "ETL Pipelines",

  // ── Data Warehousing ──
  "data warehousing": "Data Warehousing",
  "data warehouse": "Data Warehousing",
  snowflake: "Data Warehousing",
  redshift: "Data Warehousing",
  bigquery: "Data Warehousing",

  // ── Infrastructure as Code ──
  iac: "Infrastructure as Code",
  "infrastructure as code": "Infrastructure as Code",
  terraform: "Infrastructure as Code",
  pulumi: "Infrastructure as Code",
  cloudformation: "Infrastructure as Code",

  // ── Monitoring ──
  monitoring: "Monitoring & Logging",
  "monitoring & logging": "Monitoring & Logging",
  prometheus: "Monitoring & Logging",
  grafana: "Monitoring & Logging",
  elk: "Monitoring & Logging",
  datadog: "Monitoring & Logging",

  // ── Containers ──
  containers: "Containers",

  // ── Penetration Testing ──
  "penetration testing": "Penetration Testing",
  "pen testing": "Penetration Testing",
  "ethical hacking": "Penetration Testing",

  // ── Cryptography ──
  cryptography: "Cryptography",
  encryption: "Cryptography",

  // ── Compliance ──
  compliance: "Compliance (ISO/SOC2)",
  "compliance (iso/soc2)": "Compliance (ISO/SOC2)",
  "iso 27001": "Compliance (ISO/SOC2)",
  soc2: "Compliance (ISO/SOC2)",

  // ── MLOps ──
  mlops: "MLOps",
  "ml ops": "MLOps",
  mlflow: "MLOps",

  // ── Feature Engineering ──
  "feature engineering": "Feature Engineering",

  // ── Manual Testing ──
  "manual testing": "Manual Testing",

  // ── Automation Testing ──
  "automation testing": "Automation Testing",
  "test automation": "Automation Testing",

  // ── Product Strategy ──
  "product strategy": "Product Strategy",
  "product management": "Product Strategy",

  // ── User Research ──
  "user research": "User Research",
  "ux research": "User Research",

  // ── Roadmapping ──
  roadmapping: "Roadmapping",
  "product roadmap": "Roadmapping",

  // ── Wireframing ──
  wireframing: "Wireframing",
  wireframes: "Wireframing",

  // ── Prototyping ──
  prototyping: "Prototyping",
  prototype: "Prototyping",

  // ── Design Systems ──
  "design systems": "Design Systems",
  "design system": "Design Systems",

  // ── Usability Testing ──
  "usability testing": "Usability Testing",

  // ── Java ──
  java: "Java",

  // ── Go ──
  go: "Go",
  golang: "Go",

  // ── C++ ──
  "c++": "C++",
  cpp: "C++",

  // ── C# ──
  "c#": "C#",
  csharp: "C#",
  "c sharp": "C#",

  // ── Tailwind ──
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",

  // ── Next.js ──
  next: "Next.js",
  "next.js": "Next.js",
  nextjs: "Next.js",
  "next js": "Next.js",
};

// ─── STEP 2: Grouped / Composite Skill Decomposition ───────
// Maps composite skill labels to their individual components.
// ────────────────────────────────────────────────────────────

const GROUPED_SKILLS = {
  "mern stack": ["MongoDB", "Express", "React JS", "Node.js"],
  mern: ["MongoDB", "Express", "React JS", "Node.js"],
  "mern stack (node.js, express, mongodb)": [
    "MongoDB",
    "Express",
    "React JS",
    "Node.js",
  ],
  "mean stack": ["MongoDB", "Express", "Angular", "Node.js"],
  mean: ["MongoDB", "Express", "Angular", "Node.js"],
  "mevn stack": ["MongoDB", "Express", "Vue.js", "Node.js"],
  "lamp stack": ["Linux", "Apache", "SQL", "PHP"],
  "full stack": ["HTML/CSS", "JavaScript", "React JS", "Node.js", "Databases"],
  frontend: ["HTML/CSS", "JavaScript", "React JS"],
  backend: ["Node.js", "REST APIs", "Databases"],
  "data science": [
    "Python",
    "Statistics",
    "Machine Learning",
    "Data Visualization",
  ],
  devops: ["Docker", "Kubernetes", "CI/CD", "Linux"],
  "node.js / java / go": ["Node.js"],
  "aws / azure / gcp": ["Cloud Platforms"],
  "react native / flutter": ["React Native / Flutter"],
  "javascript / dart": ["JavaScript / Dart"],
  "figma / design tools": ["Figma / Design Tools"],
  "selenium / cypress": ["Selenium / Cypress"],
  "cloud (aws/gcp/azure)": ["Cloud Platforms"],
};

// ─── STEP 3: Core Normalization Function ────────────────────
// Cleans a raw skill name and returns its canonical form.
// ────────────────────────────────────────────────────────────

/**
 * Normalize a raw skill name string into a clean, lowercase key
 * suitable for lookup in the alias map.
 */
function cleanKey(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[()]/g, "") // remove parens
    .replace(/\s+/g, " ") // collapse whitespace
    .replace(/\.$/, ""); // trailing dots
}

/**
 * Given a single raw skill name, return its canonical name.
 * If no alias is found, return a title-cased cleaned version.
 */
function normalizeSkillName(rawName) {
  if (!rawName || typeof rawName !== "string") return rawName;

  const key = cleanKey(rawName);

  // 1. Direct alias lookup
  if (SKILL_ALIASES[key]) {
    return SKILL_ALIASES[key];
  }

  // 2. Check if it's in the alias values already (already canonical)
  const canonicalValues = new Set(Object.values(SKILL_ALIASES));
  if (canonicalValues.has(rawName.trim())) {
    return rawName.trim();
  }

  // 3. Fuzzy: check if key contains or is contained by any alias
  for (const [aliasKey, canonical] of Object.entries(SKILL_ALIASES)) {
    // Skip very short alias keys to avoid false positives
    if (aliasKey.length < 3) continue;
    if (key.includes(aliasKey) || aliasKey.includes(key)) {
      return canonical;
    }
  }

  // 4. No match found — return cleaned title case
  return rawName.trim();
}

// ─── STEP 4: Decompose Grouped Skills ──────────────────────
// Splits composite skills into individual canonical skills.
// ────────────────────────────────────────────────────────────

/**
 * Check if a skill name represents a grouped/composite skill.
 * If yes, return array of individual canonical skill names.
 * If no, return null.
 */
function decomposeGroupedSkill(rawName) {
  if (!rawName || typeof rawName !== "string") return null;

  const key = cleanKey(rawName);

  // Direct group lookup
  if (GROUPED_SKILLS[key]) {
    return GROUPED_SKILLS[key];
  }

  // Check if name contains group keywords with items in parentheses
  // e.g., "MERN Stack (Node.js, Express, MongoDB)"
  const parenMatch = rawName.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const innerItems = parenMatch[1]
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (innerItems.length > 1) {
      return innerItems.map((item) => normalizeSkillName(item));
    }
  }

  // Check if name contains " / " separator indicating multiple skills
  // But exclude known composite names like "React Native / Flutter"
  if (rawName.includes(" / ") && !GROUPED_SKILLS[key]) {
    const parts = rawName
      .split(" / ")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      // Only decompose if parts look like individual skills (not "Node.js / Java / Go" style role requirements)
      return parts.map((item) => normalizeSkillName(item));
    }
  }

  return null;
}

// ─── STEP 5: Convert User Skill Level to Numeric ───────────
// User skills come as "beginner", "intermediate", etc.
// Role requirements use numeric 1-3 scale.
// ────────────────────────────────────────────────────────────

const LEVEL_MAP = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 3,
};

function levelToNumber(level) {
  if (typeof level === "number") return level;
  if (typeof level === "string") {
    return LEVEL_MAP[level.toLowerCase()] || 0;
  }
  return 0;
}

// ─── STEP 6: Full User Skills Normalization Pipeline ────────
// Takes the raw user.skills array and returns a Map of
// canonicalName → numericLevel with all normalization applied.
// ────────────────────────────────────────────────────────────

/**
 * Normalize the full array of user skills.
 * Returns a Map<canonicalSkillName, numericLevel>
 *
 * Handles:
 * - Alias resolution (ReactJS → React JS)
 * - Grouped skill decomposition (MERN Stack → 4 individual skills)
 * - Level normalization (string → number)
 * - Deduplication (keeps highest level if duplicates exist)
 */
export function normalizeUserSkills(skills) {
  const skillMap = new Map();

  if (!skills || !Array.isArray(skills)) return skillMap;

  for (const skill of skills) {
    const rawName = skill.name;
    const numLevel = levelToNumber(skill.level);

    // Try to decompose grouped skills first
    const decomposed = decomposeGroupedSkill(rawName);

    if (decomposed) {
      // If it's a group, each sub-skill inherits the level
      for (const subSkill of decomposed) {
        const canonical = normalizeSkillName(subSkill);
        const existing = skillMap.get(canonical) || 0;
        skillMap.set(canonical, Math.max(existing, numLevel));
      }
    }

    // Always also normalize the original name (in case it also maps directly)
    const canonical = normalizeSkillName(rawName);
    const existing = skillMap.get(canonical) || 0;
    skillMap.set(canonical, Math.max(existing, numLevel));
  }

  return skillMap;
}

// ─── STEP 7: Role Requirement Normalization ─────────────────
// Normalizes role skill names to their canonical forms
// (they should already be canonical from roleSkills.js, but
//  this provides a safety net for slash-separated names like
//  "Node.js / Java / Go")
// ────────────────────────────────────────────────────────────

/**
 * Normalize a role requirement skill name.
 * For composite role requirements like "Node.js / Java / Go",
 * returns an array of individual canonical names the user
 * could satisfy ANY ONE OF.
 *
 * Returns: { canonical: string, alternatives: string[] }
 */
export function normalizeRoleSkill(roleSkillName) {
  const key = cleanKey(roleSkillName);

  // Check if it's a known "pick one of" pattern (contains " / ")
  if (roleSkillName.includes(" / ") || roleSkillName.includes(" or ")) {
    const separator = roleSkillName.includes(" / ") ? " / " : " or ";
    const alternatives = roleSkillName
      .split(separator)
      .map((s) => normalizeSkillName(s.trim()));

    return {
      canonical: roleSkillName, // Keep the display name as-is
      alternatives, // Any one of these satisfies the requirement
    };
  }

  return {
    canonical: normalizeSkillName(roleSkillName),
    alternatives: [normalizeSkillName(roleSkillName)],
  };
}

// ─── Exports ────────────────────────────────────────────────

export {
  normalizeSkillName,
  decomposeGroupedSkill,
  levelToNumber,
  SKILL_ALIASES,
  GROUPED_SKILLS,
};
