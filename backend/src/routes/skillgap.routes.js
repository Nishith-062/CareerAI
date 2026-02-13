import { calculateSkillGap } from "../services/gapAnalysis.js";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/", protectRoute, async (req, res) => {
    
  const user = await User.findById(req.user.id);
  const result = calculateSkillGap(user);

  res.json(result);
});

export default router;
