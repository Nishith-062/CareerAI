import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";

export default function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Handle form submission
    if (formData.email === "" || formData.password === "") {
      toast.error("Please fill all the fields");
      return;
    }
    console.log(formData);
    login(formData.email, formData.password,navigate);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-neutral-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-black/0" />
        <div className="relative z-10 max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
          <p className="text-gray-400">
            "The only way to do great work is to love what you do."
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-12">
        <FieldSet className="w-md">
          <FieldLegend className="text-5xl ">Sign In</FieldLegend>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input id="email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="alex@example.com" />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="******" />
          </Field>
          <Button type="submit" onClick={handleSubmit}>Sign In</Button>
          <FieldDescription>Don't have an account? <Link to="/register">Sign Up</Link></FieldDescription>
        </FieldSet>
      </div>
    </div>
  );
}
