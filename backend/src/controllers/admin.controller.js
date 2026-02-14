import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAdminToken = (adminId, res) => {
  const secret = process.env.JWT_SECRET || "secret";
  const token = jwt.sign({ adminId }, secret, {
    expiresIn: "7d",
  });

  res.cookie("admin_jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  return token;
};

export const registerAdmin = async (req, res) => {
  const { name, email, password, adminSecret } = req.body;

  if (!name || !email || !password || !adminSecret) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Simple hardcoded secret for creating admins - in production use env var
  const SECRET_KEY =
    process.env.ADMIN_CREATION_SECRET || "create_admin_secret_123";

  if (adminSecret !== SECRET_KEY) {
    return res.status(403).json({ message: "Invalid admin creation secret" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password });
    generateAdminToken(admin._id, res);

    return res.status(201).json({
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Direct password comparison as per User model pattern (not recommended for prod but consistent)
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    generateAdminToken(admin._id, res);

    return res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("admin_jwt");
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // 1. Target Role Distribution
    const roleDistribution = await User.aggregate([
      { $match: { targetRole: { $exists: true, $ne: null } } },
      { $group: { _id: "$targetRole", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 2. Top Skills
    const topSkills = await User.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      totalUsers,
      verifiedUsers,
      roleDistribution,
      topSkills,
    });
  } catch (error) {
    console.error("Error in getSystemStats:", error);
    res.status(500).json({ message: "Error fetching system stats" });
  }
};

export const checkAdminAuth = (req, res) => {
  try {
    return res.status(200).json(req.admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
