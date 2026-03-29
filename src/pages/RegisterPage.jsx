import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: "English",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    try {
      const { data } = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        language: formData.language
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success("Registration successful!");
      navigate("/chat");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred on the server (500). Is your database connected?");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background relative overflow-hidden selection:bg-primary/30 p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none"></div>

      <Link to="/" className="mb-8 flex items-center space-x-3 relative z-10 group">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <span className="font-extrabold text-3xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Pulse Chat</span>
      </Link>
      
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-card/40 text-card-foreground rounded-2xl border border-border/50 shadow-2xl backdrop-blur-2xl relative z-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to get started with Pulse Chat
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
          <Button type="submit" className="w-full py-6 text-base font-semibold bg-linear-to-br from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-xl">
            Sign up
          </Button>
        </form>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
