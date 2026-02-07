import {Input} from "@/components/ui/input"
import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";

export default function Register() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { register } = useAuthStore();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Handle form submission
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.fullName === "" || formData.email === "" || formData.password === "" || formData.confirmPassword === "") {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      await register(formData.fullName, formData.email, formData.password);
      navigate("/verify");
    } catch (error) {
      console.error("Register failed:", error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Right Side - Visual (swapped for variety) */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-neutral-900/50 relative overflow-hidden order-last">
        <div className="absolute inset-0 bg-linear-to-bl from-blue-500/20 to-black/0" />
        <div className="relative z-10 max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Future</h2>
          <p className="text-gray-400">
            Start your journey towards a smarter, data-driven career path today.
          </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-12">
        <FieldSet className="w-md">
          <FieldLegend className="text-5xl ">Sign Up</FieldLegend>
          <Field>
            <FieldLabel>Full Name</FieldLabel>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Alex " />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input id="email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="alex@example.com" />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="******" />
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <Input id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="******" />
          </Field>
          <Button type="submit" onClick={handleSubmit}>Sign Up</Button>
          <FieldDescription>Already have an account? <Link to="/login">Login</Link></FieldDescription>
        </FieldSet>
      </div>
    </div>
  );
}
