"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import logoSvg from "../../assets/logo.svg";

interface ForgotPasswordEmailFormProps {
  onBackToLogin: () => void;
  onSubmit: (email: string) => void;
  initialEmail?: string;
  isLoading?: boolean;
}

export function ForgotPasswordEmailForm({
  onBackToLogin,
  onSubmit,
  initialEmail = "",
  isLoading = false
}: ForgotPasswordEmailFormProps) {
  const [email, setEmail] = useState(initialEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-comfortaa">
      <CardHeader className="text-center pb-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
        </div>

        {/* Title */}
        <CardTitle className="text-[50px] font-comfortaa font-semibold text-[#78746C] leading-[1.4]">
          FORGOT PASSWORD
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 px-12 pb-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <p className="text-[20px] font-comfortaa text-[#78746C] text-center leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Email Field */}
          <div className="space-y-4">
            <label
              htmlFor="email"
              className="block text-[30px] font-comfortaa font-semibold text-[#121212] text-center"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-comfortaa text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              onClick={onBackToLogin}
              className="flex-1 bg-transparent text-[#121212] hover:bg-[rgba(0,0,0,0.1)] border-2 border-black rounded-[30px] py-4 text-[25px] font-comfortaa font-medium transition-all duration-200"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[rgba(203,175,135,0.3)] text-[#121212] hover:bg-[rgba(203,175,135,0.5)] border-2 border-black rounded-[30px] py-4 text-[25px] font-comfortaa font-semibold backdrop-blur-[100px] transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'linear-gradient(0deg, rgba(203, 175, 135, 0.3), rgba(203, 175, 135, 0.3)), linear-gradient(0deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))'
              }}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordEmailForm;
