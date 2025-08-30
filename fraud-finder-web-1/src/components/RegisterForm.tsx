// RegisterForm.tsx - User Registration for Credit Fraud Detector
// -------------------------------------------------------------
// Handles user sign-up, validation, and error display.
// Refined for clarity, maintainability, and a human touch.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { authService, RegisterRequest } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  // State for form fields and UI
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation helpers
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Client-side validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);

    try {
      await authService.register(formData);
      toast({
        title: "Registration Successful",
        description: "Welcome! Your account has been created.",
        variant: "default",
      });
      onSuccess();
    } catch (err) {
      let message = "Registration failed. Please try again.";
      if (err instanceof Error) {
        if (err.message === "Failed to fetch") {
          message = "Cannot connect to the server. Please check your internet connection or try again later.";
        } else if (err.message.toLowerCase().includes("user already exists")) {
          message = "An account with this email already exists. Please sign in or use a different email.";
        } else if (err.message.toLowerCase().includes("network")) {
          message = "Network error. Please check your connection.";
        } else {
          message = err.message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (field: keyof RegisterRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Create Account</CardTitle>
        <CardDescription className="text-blue-200">
          Sign up to start using FraudGuard AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="pl-10 bg-slate-700/50 border-blue-800/50 text-white placeholder:text-blue-300"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="pl-10 bg-slate-700/50 border-blue-800/50 text-white placeholder:text-blue-300"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="pl-10 pr-10 bg-slate-700/50 border-blue-800/50 text-white placeholder:text-blue-300"
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0 text-blue-400 hover:text-blue-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-blue-300">Password must be at least 6 characters long</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Switch to Login */}
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 