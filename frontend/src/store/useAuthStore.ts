import { create } from "zustand";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  fullname: string;
  isVerified: boolean;
  resume?: string;
  text?: string;
  skills?: {
    name: string;
    level: string;
  }[];
  ats?: {
    score: number;
    feedback: string;
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
  setIsCheckingAuth: (isCheckingAuth: boolean) => void;
  register: (
    fullname: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  setUser: (user: any) => set({ user }),
  isCheckingAuth: false,
  setIsCheckingAuth: (isCheckingAuth: boolean) => set({ isCheckingAuth }),
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
      set({ user: response.data });
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Verify failed:", error);
      throw error;
    }
  },
  login: async (email: string, password: string, navigate?: any) => {
    try {
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
    }
  },
  register: async (fullname: string, email: string, password: string) => {
    try {
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
    }
  },
  logout: () => {
    set({ user: null });
  },
}));

export default useAuthStore;
