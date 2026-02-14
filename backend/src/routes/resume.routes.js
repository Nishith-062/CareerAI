import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../utils/cloudinary.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { PDFParse } from "pdf-parse";
import User from "../models/user.model.js";
import { analyzeResume } from "../utils/analyzeResume.js";
import verifySkillsWithGithub from "../utils/githubScanner.js";
import { normalizeSkillName } from "../utils/skillNormalizer.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For video uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post(
  "/upload",
  protectRoute,
  upload.single("resume"),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const parser = new PDFParse({ url: file.path });
      const text = await parser.getText();
      // console.log(text.text);

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        folder: "resumes",
      });

      const user = await User.findById(userId);
      user.resume = result.secure_url;
      user.text = text.text;
      await user.save();

      return res
        .status(200)
        .json({ message: "File uploaded successfully", result, text });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  },
);

router.post("/analyze", protectRoute, async (req, res) => {
  console.log("Analyze route hit");
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const text = user.text;
    if (!text) {
      return res.status(400).json({ message: "No text found" });
    }
    const result = await analyzeResume(text);
    // console.log(result);

    if (typeof result !== "string") {
      throw new Error("Invalid response format from AI service");
    }

    let githubSkillsMap = new Map();
    if (user.githubUsername) {
      try {
        const verificationResults = await verifySkillsWithGithub(
          user.githubUsername,
        );
        const parsedGithubSkills = JSON.parse(verificationResults);
        Object.entries(parsedGithubSkills).forEach(([skill, score]) => {
          githubSkillsMap.set(normalizeSkillName(skill), score);
        });
      } catch (error) {
        console.error("Error fetching GitHub skills:", error);
      }
    }

    const cleanResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    // console.log(cleanResult);
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanResult);
    } catch (parseError) {
      console.error("Initial JSON parse failed:", parseError.message);

      // Attempt to extract JSON if it's wrapped in text
      const jsonMatch = cleanResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResult = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          throw new Error("Failed to extract valid JSON from response");
        }
      } else {
        throw new Error("No JSON object found in response");
      }
    }
    // console.log(parsedResult);

    user.ats.score = parsedResult.atsScore;
    // user.ats.feedback = parsedResult.feedback;
    user.feedback.strengths = parsedResult.feedback.strengths;
    user.feedback.weaknesses = parsedResult.feedback.weaknesses;
    user.feedback.improvements = parsedResult.feedback.improvements;

    // Normalize and verify skills
    user.skills = parsedResult.skills.map((skill) => {
      const normalizedName = normalizeSkillName(skill.name);
      const githubScore = githubSkillsMap.get(normalizedName);

      return {
        name: normalizedName,
        level: skill.level,
        verificationScore: githubScore !== undefined ? githubScore : 0.1,
        verified: githubScore !== undefined,
        verificationSource: githubScore !== undefined ? "github" : "resume",
      };
    });
    await user.save();
    const userObject = user.toObject();
    delete userObject.password;
    return res
      .status(200)
      .json({ message: "Resume analyzed successfully", user: userObject });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});
router.get("/verify", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { githubUsername } = user;
    if (!githubUsername) {
      return res
        .status(400)
        .json({
          message: "GitHub username not set. Please update your profile first.",
        });
    }

    const verificationResults = await verifySkillsWithGithub(githubUsername);
    const parsedGithubSkills = JSON.parse(verificationResults);

    // Build a map of normalized skill name -> score
    const githubSkillsMap = new Map();
    Object.entries(parsedGithubSkills).forEach(([skill, score]) => {
      githubSkillsMap.set(normalizeSkillName(skill), score);
    });

    // Update each existing skill with GitHub verification data
    user.skills = user.skills.map((skill) => {
      const normalizedName = normalizeSkillName(skill.name);
      const githubScore = githubSkillsMap.get(normalizedName);

      return {
        name: normalizedName,
        level: skill.level,
        verificationScore:
          githubScore !== undefined ? githubScore : skill.verificationScore,
        verified: githubScore !== undefined ? true : skill.verified,
        verificationSource:
          githubScore !== undefined ? "github" : skill.verificationSource,
      };
    });

    await user.save();
    const userObject = user.toObject();
    delete userObject.password;
    return res
      .status(200)
      .json({ message: "Skills verified successfully", user: userObject });
  } catch (error) {
    console.error("Error fetching GitHub skills:", error);
    return res.status(500).json({ message: "Error fetching GitHub skills" });
  }
});

export default router;
