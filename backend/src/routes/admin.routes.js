import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAllUsers,
  deleteUser,
  checkAdminAuth,
  getSystemStats,
} from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/adminAuth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/checkAuth", protectAdminRoute, checkAdminAuth);

// Protected routes
router.get("/users", protectAdminRoute, getAllUsers);
router.delete("/users/:id", protectAdminRoute, deleteUser);
router.get("/stats", protectAdminRoute, getSystemStats);

export default router;
