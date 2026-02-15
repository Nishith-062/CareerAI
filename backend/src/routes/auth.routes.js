import express from "express";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/mailGrid.js";
import { generateToken } from "../utils/jwt.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import verifySkillsWithGithub from "../utils/githubScanner.js";
import { normalizeSkillName } from "../utils/skillNormalizer.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  console.log(req.body);

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists", existingUser);
      return res.status(400).json({ message: "User already exists" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationEmail(email, otp);
    const user = await User.create({ fullname, email, password, otp });
    generateToken(user._id, res);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ user, message: "User verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationEmail(email, otp);
    user.otp = otp;
    await user.save();
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    generateToken(user._id, res);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/checkAuth", protectRoute, (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/updateUser", protectRoute, async (req, res) => {
  try {
    const { fullname, password, targetRole, githubUsername } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (fullname) {
      user.fullname = fullname;
    }
    if (password) {
      user.password = password;
    }
    if (targetRole) {
      user.targetRole = targetRole;
      console.log(targetRole);
      
    }
    if (githubUsername) {
      user.githubUsername = githubUsername;
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
    }
    await user.save();
    return res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
});

export default router;
