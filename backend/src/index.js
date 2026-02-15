import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/Db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import resumeRoutes from "./routes/resume.routes.js";
import skillgapRoutes from "./routes/skillgap.routes.js";
import oppurtunityRoutes from "./routes/oppurtunities.route.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import livekitRoutes from "./routes/livekit.routes.js";
const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/skillgap", skillgapRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/oppurtunites", oppurtunityRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/livekit", livekitRoutes);

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
