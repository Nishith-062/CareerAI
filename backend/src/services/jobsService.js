import axios from "axios";
import dotenv from "dotenv";
import natural from "natural";

dotenv.config();

const { TfIdf } = natural;

//////////////////////////////////////////////////////
// JOB SOURCES CONFIG
//////////////////////////////////////////////////////

const JOB_SOURCES = {
  india: [
    { name: "JSearch India", function: "fetchFromJSearch", country: "IN" },
    { name: "Adzuna India", function: "fetchFromAdzuna", country: "IN" },
  ],
  japan: [
    { name: "JSearch Japan", function: "fetchFromJSearch", country: "JP" },
    { name: "Adzuna Japan", function: "fetchFromAdzuna", country: "JP" },
  ],
  us: [
    { name: "JSearch US", function: "fetchFromJSearch", country: "US" },
    { name: "Adzuna US", function: "fetchFromAdzuna", country: "US" },
  ],
  uk: [
    { name: "JSearch UK", function: "fetchFromJSearch", country: "UK" },
    { name: "Adzuna UK", function: "fetchFromAdzuna", country: "UK" },
  ],
  canada: [
    { name: "JSearch Canada", function: "fetchFromJSearch", country: "CA" },
    { name: "Adzuna Canada", function: "fetchFromAdzuna", country: "CA" },
  ],
  australia: [
    { name: "JSearch Australia", function: "fetchFromJSearch", country: "AU" },
    { name: "Adzuna Australia", function: "fetchFromAdzuna", country: "AU" },
  ],
  germany: [
    { name: "JSearch Germany", function: "fetchFromJSearch", country: "DE" },
    { name: "Adzuna Germany", function: "fetchFromAdzuna", country: "DE" },
  ],
  france: [
    { name: "JSearch France", function: "fetchFromJSearch", country: "FR" },
    { name: "Adzuna France", function: "fetchFromAdzuna", country: "FR" },
  ],
  global: [
    { name: "JSearch Global", function: "fetchFromJSearch", country: "US" },
    { name: "Adzuna Global", function: "fetchFromAdzuna", country: "US" },
    {
      name: "Workday Careers",
      function: "fetchWorkdayJobs",
      country: "global",
    },
  ],
};

//////////////////////////////////////////////////////
// TEXT CLEANING
//////////////////////////////////////////////////////

function cleanText(text = "") {
  return text
    .toLowerCase()
    .replace(/\S+@\S+/g, "")
    .replace(/\b\d{10}\b/g, "")
    .replace(/http\S+|www\S+/g, "")
    .replace(/\b(page|resume|cv|contact|phone|email)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

//////////////////////////////////////////////////////
// DOMAIN QUERIES — maps targetRole → job search terms
//////////////////////////////////////////////////////

const DOMAIN_QUERIES = {
  // ── Development Roles ──
  "Full Stack Developer": [
    "Full Stack Developer",
    "Full Stack Engineer",
    "MERN Stack Developer",
    "Software Engineer Full Stack",
    "Web Developer",
  ],
  "Frontend Developer": [
    "Frontend Developer",
    "Front End Engineer",
    "React Developer",
    "UI Developer",
    "JavaScript Developer",
  ],
  "Backend Developer": [
    "Backend Developer",
    "Backend Engineer",
    "Node.js Developer",
    "API Developer",
    "Server Side Developer",
  ],

  // ── Data & AI Roles ──
  "ML Engineer": [
    "Machine Learning Engineer",
    "ML Engineer",
    "AI Engineer",
    "Deep Learning Engineer",
    "NLP Engineer",
  ],
  "Data Scientist": [
    "Data Scientist",
    "Data Analyst",
    "Business Intelligence Analyst",
    "Applied Scientist",
    "Quantitative Analyst",
  ],
  "Data Engineer": [
    "Data Engineer",
    "ETL Developer",
    "Big Data Engineer",
    "Data Pipeline Engineer",
    "Analytics Engineer",
  ],

  // ── Infrastructure & Ops Roles ──
  "DevOps Engineer": [
    "DevOps Engineer",
    "Site Reliability Engineer",
    "SRE",
    "Platform Engineer",
    "Release Engineer",
  ],
  "Cloud Engineer": [
    "Cloud Engineer",
    "AWS Engineer",
    "Azure Engineer",
    "Cloud Solutions Architect",
    "Cloud Infrastructure Engineer",
  ],

  // ── Mobile ──
  "Mobile Developer": [
    "Mobile Developer",
    "React Native Developer",
    "Flutter Developer",
    "iOS Developer",
    "Android Developer",
  ],

  // ── Security ──
  "Cybersecurity Engineer": [
    "Cybersecurity Engineer",
    "Security Analyst",
    "Information Security Engineer",
    "Penetration Tester",
    "SOC Analyst",
  ],

  // ── QA ──
  "QA Engineer": [
    "QA Engineer",
    "Quality Assurance Engineer",
    "Test Automation Engineer",
    "SDET",
    "Software Tester",
  ],

  // ── Product & Design ──
  "Product Manager": [
    "Product Manager",
    "Associate Product Manager",
    "Technical Product Manager",
    "Product Owner",
    "Program Manager",
  ],
  "UI/UX Designer": [
    "UI/UX Designer",
    "UX Designer",
    "Product Designer",
    "Interaction Designer",
    "Visual Designer",
  ],
};

//////////////////////////////////////////////////////
// SKILL → QUERY — maps canonical skill names to
// effective job search queries
//////////////////////////////////////////////////////

const SKILL_TO_QUERY = {
  // Languages & Frameworks
  JavaScript: "JavaScript Developer",
  "React JS": "React Developer",
  "Node.js": "Node.js Developer",
  Python: "Python Developer",
  Java: "Java Developer",
  Go: "Golang Developer",
  "C++": "C++ Developer",
  "C#": "C# .NET Developer",
  TypeScript: "TypeScript Developer",
  "Next.js": "Next.js Developer",
  Express: "Node.js Backend Developer",

  // Data & ML
  "Machine Learning": "Machine Learning Engineer",
  "Deep Learning": "Deep Learning Engineer",
  "Data Visualization": "Data Analyst",
  Statistics: "Data Scientist",
  SQL: "SQL Developer",
  Spark: "Big Data Engineer",
  "ETL Pipelines": "ETL Developer",
  "Data Warehousing": "Data Warehouse Engineer",
  "Feature Engineering": "ML Engineer",
  MLOps: "MLOps Engineer",
  Airflow: "Data Pipeline Engineer",

  // DevOps & Cloud
  Docker: "DevOps Engineer",
  Kubernetes: "Kubernetes Engineer",
  "CI/CD": "DevOps Engineer",
  "Cloud Platforms": "Cloud Engineer",
  "Infrastructure as Code": "Infrastructure Engineer",
  "Monitoring & Logging": "SRE Engineer",
  Linux: "Linux System Administrator",

  // Security
  "Network Security": "Cybersecurity Analyst",
  "Penetration Testing": "Penetration Tester",
  Cryptography: "Security Engineer",
  "Compliance (ISO/SOC2)": "Compliance Analyst",

  // Mobile
  "React Native / Flutter": "Mobile App Developer",

  // Testing
  "Manual Testing": "QA Tester",
  "Automation Testing": "Test Automation Engineer",
  "Selenium / Cypress": "Automation QA Engineer",
  "API Testing": "API QA Engineer",

  // Design
  "Figma / Design Tools": "UI/UX Designer",
  Wireframing: "UX Designer",
  Prototyping: "Product Designer",
  "Design Systems": "Design System Engineer",

  // Product
  "Product Strategy": "Product Manager",
  Roadmapping: "Product Manager",
  "User Research": "UX Researcher",

  // General
  "REST APIs": "API Developer",
  "System Design": "Software Architect",
  "Authentication & Security": "Security Engineer",
  "Caching (Redis)": "Backend Engineer",
  Git: "Software Developer",
  "Agile/Scrum": "Scrum Master",
  Databases: "Database Developer",
  MongoDB: "MongoDB Developer",
  "HTML/CSS": "Frontend Developer",
  "Tailwind CSS": "Frontend Developer",
  "State Management": "React Developer",
  "Responsive Design": "Frontend Developer",
  "Web Performance": "Frontend Performance Engineer",
};

//////////////////////////////////////////////////////
// buildSearchQueries — 3‑tier strategy
// 1. Domain (targetRole) queries
// 2. Skills-derived queries (top skills → job titles)
// 3. Fallback
//////////////////////////////////////////////////////

function buildSearchQueries(skills = [], domain = "") {
  const domainQueries = [];
  const skillQueries = [];

  // ── Tier 1: Domain / targetRole queries ──
  if (domain && DOMAIN_QUERIES[domain]) {
    domainQueries.push(...DOMAIN_QUERIES[domain]);
  }

  // ── Tier 2: Skill-derived queries ──
  if (skills.length > 0) {
    // Build a set of already-used queries (lowercase) to avoid duplicates
    const used = new Set(domainQueries.map((q) => q.toLowerCase()));

    for (const skill of skills) {
      const mapped = SKILL_TO_QUERY[skill];
      if (mapped && !used.has(mapped.toLowerCase())) {
        skillQueries.push(mapped);
        used.add(mapped.toLowerCase());
      }
    }
  }

  // ── Tier 3: Fallback ──
  if (domainQueries.length === 0 && skillQueries.length === 0) {
    return ["Software Engineer", "Developer"];
  }

  // Combine: up to 3 domain + up to 2 skill-derived (max 5 total)
  const combined = [...domainQueries.slice(0, 3), ...skillQueries.slice(0, 2)];

  return combined;
}

//////////////////////////////////////////////////////
// JSEARCH
//////////////////////////////////////////////////////

async function fetchFromJSearch(query, country = "IN") {
  if (!process.env.RAPID_API_KEY) return [];
  console.log(process.env.RAPID_API_KEY);

  try {
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      params: {
        query,
        num_pages: "2",
        date_posted: "today",
        ...(country !== "global" && { country }),
      },
    });

    return (response.data.data || [])
      .filter((job) => job.job_apply_link)
      .map((job) => ({
        job_title: job.job_title,
        employer_name: job.employer_name || "Unknown Company",
        job_city: job.job_city || "",
        job_country: job.job_country || country,
        job_is_remote: job.job_is_remote || false,
        job_description: job.job_description || "",
        job_apply_link: job.job_apply_link,
        source: "JSearch",
        posted_date: job.job_posted_at_datetime_utc,
        salary_min: job.job_min_salary,
        salary_max: job.job_max_salary,
      }))
      .slice(0, 25);
  } catch (err) {
    console.log(err);
    console.error("JSearch error:", err.message);
    return [];
  }
}

//////////////////////////////////////////////////////
// ADZUNA
//////////////////////////////////////////////////////

async function fetchFromAdzuna(query, country = "IN") {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_API_KEY) return [];

  const countryMap = { IN: "in", US: "us" };
  const countryCode = countryMap[country] || "us";

  try {
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1`,
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_API_KEY,
          what: query,
          results_per_page: 50,
          max_days_old: 30,
        },
      },
    );

    return (response.data.results || []).map((job) => ({
      job_title: job.title,
      employer_name: job.company?.display_name || "Unknown Company",
      job_city: job.location?.area?.slice(-1)[0] || "",
      job_country: country,
      job_is_remote: false,
      job_description: job.description || "",
      job_apply_link: job.redirect_url,
      source: "Adzuna",
      posted_date: job.created,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
    }));
  } catch (err) {
    console.error("Adzuna error:", err.message);
    return [];
  }
}

//////////////////////////////////////////////////////
// WORKDAY MOCK
//////////////////////////////////////////////////////

async function fetchWorkdayJobs(query) {
  const companies = ["Amazon", "Google", "Microsoft", "IBM"];

  return companies.map((company) => ({
    job_title: query,
    employer_name: company,
    job_city: "Multiple Locations",
    job_country: "Global",
    job_is_remote: Math.random() < 0.3,
    job_description: `${company} hiring ${query}`,
    job_apply_link: "#",
    source: "Workday Careers",
    posted_date: new Date().toISOString().split("T")[0],
  }));
}

//////////////////////////////////////////////////////
// MATCH SCORE
//////////////////////////////////////////////////////

function calculateMatchScore(resumeText, jobDescription, skills = []) {
  if (!resumeText || !jobDescription) return 25;

  const tfidf = new TfIdf();
  tfidf.addDocument(cleanText(resumeText));
  tfidf.addDocument(cleanText(jobDescription));

  const terms = new Set();
  tfidf.listTerms(0).forEach((t) => terms.add(t.term));
  tfidf.listTerms(1).forEach((t) => terms.add(t.term));

  let dot = 0,
    mag1 = 0,
    mag2 = 0;

  terms.forEach((term) => {
    const v1 = tfidf.tfidf(term, 0);
    const v2 = tfidf.tfidf(term, 1);
    dot += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  const cosine = dot / (Math.sqrt(mag1) * Math.sqrt(mag2) || 1);
  let score = Math.min(Math.max(cosine * 100 * 1.5, 20), 40);

  const jdLower = jobDescription.toLowerCase();
  const skillMatches = skills.filter((s) =>
    jdLower.includes(s.toLowerCase()),
  ).length;

  score += Math.min(skillMatches * 15, 50);

  return Math.round(Math.min(Math.max(score, 10), 100));
}

//////////////////////////////////////////////////////
// GEO CATEGORIZATION
//////////////////////////////////////////////////////

function categorizeByGeography(jobs) {
  const india = [];
  const global = [];
  const remote = [];

  jobs.forEach((job) => {
    const country = (job.job_country || "").toLowerCase();
    const isRemote = job.job_is_remote;

    if (country.includes("india")) {
      isRemote ? remote.push(job) : india.push(job);
    } else {
      isRemote ? remote.push(job) : global.push(job);
    }
  });

  return { india, global, remote };
}

//////////////////////////////////////////////////////
// FRESHNESS
//////////////////////////////////////////////////////

function categorizeFreshness(dateStr) {
  if (!dateStr) return { label: "Unknown", type: "unknown" };

  const posted = new Date(dateStr);
  const today = new Date();
  const delta = Math.floor((today - posted) / (1000 * 60 * 60 * 24));

  if (delta === 0) return { label: "Posted today", type: "today" };
  if (delta <= 7) return { label: "Posted this week", type: "week" };
  if (delta <= 30) return { label: "Posted within 30 days", type: "month" };
  return { label: "Older than 30 days", type: "old" };
}

//////////////////////////////////////////////////////
// MAIN AGGREGATOR (PARALLEL + DEDUPE)
//////////////////////////////////////////////////////

async function fetchJobsDomainGeo(
  skills = [],
  resumeText = "",
  domain = "",
  geography = "",
) {
  // 1. Build smart queries from domain + skills
  const queries = buildSearchQueries(skills, domain);
  //   console.log("[JobsService] Search queries:", queries);
  console.log(geography);

  // 2. Determine Sources
  let sources = [];
  const geoLower = geography ? geography.toLowerCase() : "global";

  if (geoLower === "india" || geoLower === "in") {
    sources = JOB_SOURCES.india;
    console.log(JOB_SOURCES.india);
  } else if (geoLower === "united kingdom" || geoLower === "uk") {
    sources = JOB_SOURCES.unitedkingdom;
    console.log(JOB_SOURCES.unitedkingdom);
  } else if (geoLower === "united states" || geoLower === "us") {
    sources = JOB_SOURCES.unitedstates;
    console.log(JOB_SOURCES.unitedstates);
  } else if (geoLower === "australia" || geoLower === "au") {
    sources = JOB_SOURCES.australia;
    console.log(JOB_SOURCES.australia);
  } else if (geoLower === "canada" || geoLower === "ca") {
    sources = JOB_SOURCES.canada;
    console.log(JOB_SOURCES.canada);
  } else if (geoLower === "germany" || geoLower === "de") {
    sources = JOB_SOURCES.germany;
    console.log(JOB_SOURCES.germany);
  } else if (geoLower === "france" || geoLower === "fr") {
    sources = JOB_SOURCES.france;
    console.log(JOB_SOURCES.france);
  } else if (geoLower === "japan" || geoLower === "jp") {
    sources = JOB_SOURCES.japan;
    console.log(JOB_SOURCES.japan);
  } else {
    sources = JOB_SOURCES.global;
  }

  const functionMap = {
    fetchFromJSearch,
    fetchFromAdzuna,
    fetchWorkdayJobs,
  };

  // 3. Fire requests sequentially with delay to avoid 429
  // LIMIT TO 2 QUERIES TO AVOID RATE LIMITS
  const limitedQueries = queries.slice(0, 2);
  const results = [];

  for (const query of limitedQueries) {
    for (const source of sources) {
      const fn = functionMap[source.function];
      if (fn) {
        // 250ms delay between requests
        await new Promise((resolve) => setTimeout(resolve, 250));
        try {
          const data = await fn(query, source.country);
          results.push(data);
        } catch (err) {
          console.error(
            `Error fetching ${query} from ${source.name}:`,
            err.message,
          );
        }
      }
    }
  }

  let allJobs = results.flat();

  // 4. Match Score & De-duplication
  const unique = new Map();

  allJobs.forEach((job) => {
    const key =
      `${job.job_title}_${job.employer_name}_${job.job_city}`.toLowerCase();

    const matchScore = calculateMatchScore(
      resumeText,
      job.job_description,
      skills,
    );
    job.match_score = matchScore;

    if (!unique.has(key)) {
      unique.set(key, job);
    } else {
      // Keep the one with the higher match score
      const existing = unique.get(key);
      if (matchScore > existing.match_score) {
        unique.set(key, job);
      }
    }
  });

  // 5. Sort each category by match score (highest first)
  const categorized = categorizeByGeography([...unique.values()]);

  const sortByScore = (a, b) => (b.match_score || 0) - (a.match_score || 0);
  categorized.india.sort(sortByScore);
  categorized.global.sort(sortByScore);
  categorized.remote.sort(sortByScore);

  return categorized;
}

//////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////

export {
  fetchFromJSearch,
  fetchFromAdzuna,
  fetchWorkdayJobs,
  fetchJobsDomainGeo,
  calculateMatchScore,
  categorizeFreshness,
  cleanText,
};
