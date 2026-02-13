import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export interface Resource {
  title: string;
  url: string;
  type: string;
  _id: string;
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  skills: string[];
  estimatedDays: number;
  resources: Resource[];
  status: "upcoming" | "in-progress" | "completed";
  _id: string;
}

export interface Phase {
  phaseNumber: number;
  title: string;
  description: string;
  estimatedWeeks: number;
  milestones: Milestone[];
  _id: string;
}

export interface Roadmap {
  phases: Phase[];
  generatedAt: string;
  targetRole: string;
  _id: string;
}

interface RoadmapState {
  roadmap: Roadmap | null;
  loading: boolean;
  fetchRoadmap: () => Promise<void>;
  updateMilestoneStatus: (
    milestoneId: number,
    status: "completed" | "in-progress" | "upcoming",
  ) => Promise<void>;
  generateRoadmap: (targetRole?: string) => Promise<void>;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  roadmap: null,
  loading: false,
  fetchRoadmap: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/roadmap");
      // Assuming response.data follows the structure { roadmap: { ... } }
      set({ roadmap: response.data.roadmap, loading: false });
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      set({ loading: false });
    }
  },
  updateMilestoneStatus: async (milestoneId, status) => {
    try {
      const response = await axiosInstance.patch(
        `/roadmap/${milestoneId}/status`,
        { status },
      );
      set({ roadmap: response.data.roadmap });
    } catch (error) {
      console.error("Error updating milestone status:", error);
    }
  },
  generateRoadmap: async (targetRole) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/roadmap/generate", {
        targetRole,
      });
      set({ roadmap: response.data.roadmap, loading: false });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      set({ loading: false });
    }
  },
}));
