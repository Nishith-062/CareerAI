import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "React.js"
  category: {
    type: String,
    enum: ["Technical", "Soft Skill", "Tool", "Domain"],
    required: true,
  },

  // Market Intelligence
  demandScore: { type: Number, default: 0 }, // 0-100 score based on job frequency
  growthRate: { type: Number, default: 0 }, // % growth month-over-month
  avgSalary: { type: Number }, // Estimated logic

  relatedSkills: [{ type: String }], // e.g., React -> [Redux, TypeScript]
  resources: [
    {
      title: { type: String },
      url: { type: String },
      type: { type: String, enum: ["video", "article", "course"] },
    },
  ],
});

export const Skill = mongoose.model("Skill", skillSchema);
