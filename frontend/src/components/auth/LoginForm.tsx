"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import logoSvg from "../../assets/logo.svg";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSubmit?: (username: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onForgotPassword, onSubmit, isLoading = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData.username, formData.password);
    } else {
      console.log("Login attempt:", { username: formData.username, password: formData.password });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-comfortaa">
      <CardHeader className="text-center pb-6">
        {/* Logo - Made bigger */}
        <div className="flex justify-center mb-4">
          <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
        </div>

        {/* Welcome Text - Minimized */}
        <CardTitle className="text-[60px] font-comfortaa font-semibold text-[#78746C] leading-[1.4]">
          WELCOME
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 px-12 pb-12">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-[30px] font-comfortaa font-semibold text-[#000000] text-left leading-[1.4]"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full bg-transparent border-0 border-b border-black rounded-none px-0 py-1 text-[25px] font-comfortaa text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2 relative">
            <label
              htmlFor="password"
              className="block text-[30px] font-comfortaa font-semibold text-[#000000] text-left leading-[1.4]"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full bg-transparent border-0 border-b border-black rounded-none px-0 py-1 text-[25px] font-comfortaa text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder=""
              required
              disabled={isLoading}
            />

            {/* Forgot Password Link - Positioned to the right, below password field */}
            <div className="absolute right-0 top-full mt-2">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[25px] font-comfortaa font-medium text-[rgba(0,0,0,0.65)] hover:underline leading-[1.4]"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button - Updated with exact Figma specifications */}
          <div className="pt-16 relative">
            <Button
              type="submit"
              className="relative w-full h-[88px] bg-[rgba(203,175,135,0.3)] text-[#000000] hover:bg-[rgba(203,175,135,0.4)] border-2 border-black rounded-full font-comfortaa font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                backdropFilter: 'blur(50px)',
                background: 'rgba(203, 175, 135, 0.3)'
              }}
              disabled={isLoading}
            >
              <span className="text-[50px] font-semibold leading-[1.4] flex items-center justify-center">
                {isLoading ? "Logging in..." : "Login"}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
