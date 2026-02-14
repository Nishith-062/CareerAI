import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface Admin {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthStore {
  admin: Admin | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;
  checkAdminAuth: () => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  admin: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

  checkAdminAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/admin/checkAuth");
      set({
        admin: response.data,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ admin: null, isAuthenticated: false, isCheckingAuth: false });
      // Don't show toast for checkAuth failure as it happens on initial load
    }
  },

  loginAdmin: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      set({ admin: response.data, isAuthenticated: true, isLoading: false });
      toast.success("Admin logged in successfully");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  },

  logoutAdmin: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/admin/logout");
      set({ admin: null, isAuthenticated: false, isLoading: false });
      toast.success("Admin logged out successfully");
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },
}));
