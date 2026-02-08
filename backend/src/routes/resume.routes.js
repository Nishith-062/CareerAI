import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../utils/cloudinary.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { PDFParse } from "pdf-parse";
import User from "../models/user.model.js";
import { analyzeResume } from "../utils/analyzeResume.js";

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

router.post(
  "/analyze",
  protectRoute,
  async (req, res) => {
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
      const cleanResult = result
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const parsedResult = JSON.parse(cleanResult);
console.log(parsedResult);


      user.ats.score = parsedResult.atsScore;
      user.ats.feedback = parsedResult.feedback;
      user.skills = parsedResult.skills;
      await user.save();
      return res.status(200).json({ message: "Resume analyzed successfully", result });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  },
);

export default router;
