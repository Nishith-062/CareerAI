import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  resume: {
    type: String, // resume file URL or filename
  },
  text: {
    type: String, // extracted resume text
  },
  skills: {
    type: [
      {
        name: String,
        level: String,
      }
    ],
    default: [],
  },
  ats:{
    type:{
      score:Number,
      feedback:String,
    },
    default:{
      score:0,
      feedback:"",
    }
  }
  
});

const User = mongoose.model("User", userSchema);
export default User;
