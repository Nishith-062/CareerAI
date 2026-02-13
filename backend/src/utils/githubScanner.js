import axios from "axios";
import { normalizeSkillName } from "./skillNormalizer.js";
import dotenv from "dotenv";
dotenv.config();

const verifySkillsWithGithub = async (username) => {
  try {
    // 1. Fetch user's public repositories
    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        params: { sort: "pushed", direction: "desc" }, // Get recently updated first
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      },
    );
    // console.log(repoResponse.data);

    const repoNames = repoResponse.data.map((repo) => repo.name);
    // const repoLanguages=repoResponse.data.map((repo)=>repo.language);
    const languages = new Map();

    // languages in multiple repo checking
    for (const repoName of repoNames) {
      const response = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}/languages`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        },
      );

      // repoLanguages.push(response.data);
      Object.entries(response.data).forEach(([language, count]) => {
        languages.set(language, (languages.get(language) || 0) + 1);
      });
    }
    // multiple repo languages checking
    console.log(languages);

    const FinalResult = new Map();

    for (const [language, count] of languages.entries()) {
      if (count > 1) {
        FinalResult.set(language, 0.3);
      } else {
        FinalResult.set(language, 0.1);
      }
    }

    // checking or verifying package json
    for (const repoName of repoNames) {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/contents/package.json`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
          },
        );

        const content = Buffer.from(response.data.content, "base64").toString(
          "utf8",
        );
        const packageJson = JSON.parse(content);

        console.log(packageJson);
      } catch (err) {
        if (err.response?.status === 404) {
          console.log(`${repoName} has no package.json`);
        } else {
          console.error(`Error in ${repoName}:`, err.message);
        }
      }
    }

    // recent activity +0.2

    const recentActivity = new Set();

    for (const repoName of repoNames) {
      const response = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}/languages`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        },
      );

      // repoLanguages.push(response.data);
      Object.entries(response.data).forEach(([language, count]) => {
        recentActivity.add(language);
      });
    }
    for (const language of recentActivity){
      if (language in FinalResult){
        FinalResult.set(language, FinalResult.get(language)+0.2)
      }
    }


const obj = Object.fromEntries(FinalResult);
const json = JSON.stringify(obj);
console.log(json);


    return json;
  } catch (error) {
    console.log(error.message);
    return {};
  }
};

export default verifySkillsWithGithub;
