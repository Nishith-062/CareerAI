import express from "express";
import cors from "cors";    
import dotenv from "dotenv";
import connectDB from "./utils/Db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();


app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    connectDB();

    console.log("Server is running on port 3000");
});