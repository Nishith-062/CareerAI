import express from "express";
import User from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/mailGrid.js";
import { generateToken } from "../utils/jwt.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", async(req, res) => {
    const {fullname, email, password} = req.body;
    console.log(req.body);
    

    if(!fullname || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        const existingUser = await User.findOne({email});

        if(existingUser){
            console.log("User already exists",existingUser);
            return res.status(400).json({message:"User already exists"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendVerificationEmail(email, otp);
        const user = await User.create({fullname, email, password, otp});
        generateToken(user._id, res);
        return res.status(201).json({message:"User registered successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

router.post("/verify", async(req, res) => {
    const {email, otp} = req.body;
    if(!email || !otp){
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user.otp !== otp){
            return res.status(400).json({message:"Invalid OTP"});
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({message:"User verified successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


router.post("/logout", (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({message:"User logged out successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user.password !== password){
            return res.status(401).json({message:"Invalid password"});
        }
        generateToken(user._id, res);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});


router.get('/checkAuth',protectRoute, (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
});

export default router;
