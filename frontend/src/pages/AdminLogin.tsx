import { useNavigate } from "react-router-dom";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loginAdmin } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.email === "" || formData.password === "") {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      await loginAdmin(formData.email, formData.password);
      navigate("/admin"); // Redirect to admin dashboard
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-neutral-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-900/20 to-black/0" />
        <div className="relative z-10 max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Admin Portal</h2>
          <p className="text-gray-400">
            "With great power comes great responsibility."
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-12">
        <FieldSet className="w-md">
          <FieldLegend className="text-5xl ">Admin Login</FieldLegend>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="admin@career-ai.com"
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="******"
            />
          </Field>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700"
          >
            Login as Admin
          </Button>
        </FieldSet>
      </div>
    </div>
  );
}
