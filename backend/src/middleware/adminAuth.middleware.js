import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const protectAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.admin_jwt; // Use a different cookie name for admin

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Admin Token Provided" });
    }

    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Admin Token" });
    }

    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not Found" });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.log("Error in protectAdminRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
