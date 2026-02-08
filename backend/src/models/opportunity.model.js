import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time", "Hackathon", "Research"],
      required: true,
    },
    location: { type: String }, // "Remote", "Bangalore", etc.
    description: { type: String },

    // Key for Matching Engine
    requiredSkills: [
      {
        name: { type: String },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },
        mandatory: { type: Boolean, default: true }, // "Must have" vs "Good to have"
      },
    ],

    stipend: { type: String }, // Or Salary range
    deadline: { type: Date },
    applyLink: { type: String },
    source: { type: String }, // 'internal', 'linkedin_scrape', 'manual'

    // Meta needed for trending analysis
    postedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
