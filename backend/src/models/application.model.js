import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Rejected", "Offer", "Accepted"],
      default: "Applied",
    },
    matchPercentage: { type: Number }, // Snapshot of match % at time of application
    notes: { type: String },
  },
  { timestamps: true },
);

export const Application = mongoose.model("Application", applicationSchema);
