import { Router } from "express";
import * as jobService from "../services/jobsService.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/fetch-online-jobs", protectRoute, async (req, res) => {

    try {
        
    
  const { skills, text,targetRole } = req.user;
  const skillArray = skills.map((skill) => skill.name);
//   console.log(skillArray);
// console.log(req.user,'asdf');

  
  const { geography } = req.body||{geography:"global"};
  console.log(geography,'asdf');
  
  const jobs = await jobService.fetchJobsDomainGeo(
    skillArray,
    text,
    targetRole,
    geography,
  );
  res.json(jobs)
} catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
}

});

export default router;
