import { create } from "zustand";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  fullname: string;
  isVerified: boolean;
  resume?: string;
  text?: string;
  githubUsername?: string;
  targetRole?: string;
  skills: {
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
    verificationScore: number;
    verified: boolean;
    verificationSource: "self" | "resume" | "github";
    _id?: string;
  }[];
  ats: {
    score: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  roadmap?: {
    phases: {
      phaseNumber: number;
      title: string;
      description: string;
      estimatedWeeks: number;
      milestones: {
        id: number;
        title: string;
        description: string;
        skills: string[];
        estimatedDays: number;
        resources: {
          title: string;
          url: string;
          type: "course" | "project" | "article" | "video" | "certification";
        }[];
        status: "completed" | "in-progress" | "upcoming";
      }[];
    }[];
    generatedAt: string;
    targetRole: string;
  };
}
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  checkAuth: (navigate?: any) => Promise<void>;
  verify: (email: string, otp: string) => Promise<void>;
  login: (email: string, password: string, navigate?: any) => Promise<void>;
  isCheckingAuth: boolean;
  isLoading: boolean;
  setIsCheckingAuth: (isCheckingAuth: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  register: (
    fullname: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (
    targetRole: string,
    name: string,
    password: string,
    githubUsername: string,
  ) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  setUser: (user: any) => set({ user }),
  isCheckingAuth: false,
  isLoading: false,
  setIsCheckingAuth: (isCheckingAuth: boolean) => set({ isCheckingAuth }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  checkAuth: async (navigate?: any) => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get("/auth/checkAuth");
      set({ user: response.data });
    } catch (error: any) {
      if (error.response.status === 500) {
        toast.error(error.response.data.message);
        if (navigate) navigate("/login");
      }
      console.error("Check auth failed:", error);
      throw error;
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  verify: async (email: string, otp: string) => {
    try {
      console.log("user", get().user);

      const response = await axiosInstance.post("/auth/verify", {
        email,
        otp,
      });
      set({ user: response.data.user });
      toast.success(response.data.message);


    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Verify failed:", error);
      throw error;
    }
  },
  login: async (email: string, password: string, navigate?: any) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: response.data });
      if (response.data.isVerified) {
        if (navigate) navigate("/");
      } else {
        console.log("useasfr", get().user);
        if (navigate) navigate("/verify");
      }
    } catch (error: any) {
      if (error.response.status === 403 || error.response.status === 404) {
        toast.error(error.response.data.message);
        if (navigate) navigate("/verify");
      }
      console.error("Login failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  register: async (fullname: string, email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/auth/register", {
        fullname,
        email,
        password,
      });
      console.log(response.data);

      set({ user: response.data });
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ user: null });
  },
  resendOtp: async (email: string) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post("/auth/resend-otp", {
        email,
      });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Resend OTP failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (
    targetRole: string,
    name: string,
    password: string,
    githubUsername: string,
  ) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put("/auth/updateUser", {
        targetRole,
        name,
        password,
        githubUsername,
      });
      set((state) => {
        if (!state.user) return {};
        return {
          user: {
            ...state.user,
            targetRole: targetRole,
            fullname: name,
            githubUsername: githubUsername,
          },
        };
      });
      set({user:res.data.user})
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
