import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import { calculateSkillGap } from "../services/gapAnalysis.js";
import { generateRoadmap } from "../utils/generateRoadmap.js";

const router = Router();

// Helper to handle roadmap generation logic
const handleGenerateRoadmap = async (user, res) => {
  if (!user.targetRole) {
    return res
      .status(400)
      .json({ message: "Please set a target role first in Settings." });
  }

  if (!user.skills || user.skills.length === 0) {
    return res.status(400).json({
      message: "Please upload and analyze your resume first.",
    });
  }

  // Run skill gap analysis
  const gapResult = calculateSkillGap(user);

  // Generate roadmap via Gemini AI
  const roadmapData = await generateRoadmap({
    targetRole: user.targetRole,
    masteredSkills: gapResult.masteredSkills,
    gapSkills: gapResult.gapSkills,
    missingSkills: gapResult.missingSkills,
    feedback: user.feedback,
    userSkills: user.skills,
  });

  // Save to user document
  user.roadmap = {
    phases: roadmapData.phases,
    generatedAt: new Date(),
    targetRole: user.targetRole,
  };
  await user.save();

  return res.status(200).json({
    message: "Roadmap generated successfully",
    roadmap: user.roadmap,
  });
};

// Generate a personalized roadmap (POST allows changing target role)
router.post("/generate", protectRoute, async (req, res) => {
  try {
    const { targetRole } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetRole) {
      user.targetRole = targetRole;
      await user.save();
    }

    await handleGenerateRoadmap(user, res);
  } catch (error) {
    console.error("Roadmap generation error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Keep GET for backward compatibility or direct calls
router.get("/generate", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await handleGenerateRoadmap(user, res);
  } catch (error) {
    console.error("Roadmap generation error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Update milestone status
router.patch("/:milestoneId/status", protectRoute, async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status } = req.body; // "completed", "in-progress", "upcoming"

    if (!["completed", "in-progress", "upcoming"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let milestoneFound = false;

    // Find and update the milestone
    if (user.roadmap && user.roadmap.phases) {
      for (const phase of user.roadmap.phases) {
        const milestone = phase.milestones.find(
          (m) => m.id === parseInt(milestoneId),
        );
        if (milestone) {
          milestone.status = status;
          milestoneFound = true;
          // If marking as completed, potentially update skills?
          // For now, just update status.
          break;
        }
      }
    }

    if (!milestoneFound) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    await user.save();

    return res.status(200).json({
      message: "Milestone status updated",
      roadmap: user.roadmap,
    });
  } catch (error) {
    console.error("Update milestone status error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Get the saved roadmap
router.get("/", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ roadmap: user.roadmap });
  } catch (error) {
    console.error("Roadmap fetch error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
