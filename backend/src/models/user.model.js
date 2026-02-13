import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  resume: {
    type: String, // resume file URL or filename
  },
  text: {
    type: String, // extracted resume text
  },
  githubUsername: {
    type: String,
    default: "",
  },
  skills: {
    type: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          required: true,
        },

        verificationScore: {
          type: Number,
          default: 0.1, // self-declared baseline
          min: 0,
          max: 1,
        },

        verified: {
          type: Boolean,
          default: false,
        },

        verificationSource: {
          type: String,
          enum: ["self", "resume", "github"],
          default: "self",
        },
      },
    ],
    default: [],
  },
  targetRole: {
    type: String,
    enum: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "ML Engineer",
      "Data Scientist",
      "Data Engineer",
      "DevOps Engineer",
      "Cloud Engineer",
      "Mobile Developer",
      "Cybersecurity Engineer",
      "QA Engineer",
      "Product Manager",
      "UI/UX Designer",
    ],
  },
  ats: {
    type: {
      score: Number,
    },
    default: {
      score: 0,
    },
  },
  feedback: {
    type: {
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      improvements: {
        type: [String],
        default: [],
      },
    },
    default: {
      strengths: [],
      weaknesses: [],
      improvements: [],
    },
  },
  roadmap: {
    type: {
      phases: {
        type: [
          {
            phaseNumber: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String },
            estimatedWeeks: { type: Number },
            milestones: {
              type: [
                {
                  id: { type: Number, required: true },
                  title: { type: String, required: true },
                  description: { type: String },
                  skills: { type: [String], default: [] },
                  estimatedDays: { type: Number },
                  resources: {
                    type: [
                      {
                        title: { type: String },
                        url: { type: String },
                        type: {
                          type: String,
                          enum: [
                            "course",
                            "project",
                            "article",
                            "video",
                            "certification",
                          ],
                        },
                      },
                    ],
                    default: [],
                  },
                  status: {
                    type: String,
                    enum: ["completed", "in-progress", "upcoming"],
                    default: "upcoming",
                  },
                },
              ],
              default: [],
            },
          },
        ],
        default: [],
      },
      generatedAt: { type: Date },
      targetRole: { type: String },
    },
    default: {
      phases: [],
      generatedAt: null,
      targetRole: null,
    },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
