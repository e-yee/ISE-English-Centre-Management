"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import logoSvg from "../../assets/logo.svg";

interface ForgotPasswordNewPasswordFormProps {
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  email: string;
  isLoading?: boolean;
}

export function ForgotPasswordNewPasswordForm({
  onSubmit,
  email,
  isLoading = false
}: ForgotPasswordNewPasswordFormProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.newPassword, formData.confirmPassword);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-roboto">
      <CardHeader className="text-center pb-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
        </div>

        {/* Title */}
        <CardTitle className="text-[50px] font-roboto font-semibold text-[#78746C] leading-[1.4]">
          NEW PASSWORD
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 px-12 pb-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[20px] font-roboto text-[#78746C] leading-relaxed">
              Enter your new password for
            </p>
            <p className="text-[22px] font-roboto font-semibold text-[#121212]">{email}</p>
          </div>

          {/* New Password Field */}
          <div className="space-y-4">
            <label
              htmlFor="newPassword"
              className="block text-[30px] font-roboto font-semibold text-[#121212] text-center"
            >
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Enter new password"
              required
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-red-600 text-[18px] font-roboto text-center">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-4">
            <label
              htmlFor="confirmPassword"
              className="block text-[30px] font-roboto font-semibold text-[#121212] text-center"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Confirm new password"
              required
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-[18px] font-roboto text-center">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-[rgba(203,175,135,0.3)] text-[#121212] hover:bg-[rgba(203,175,135,0.5)] border-2 border-black rounded-[30px] py-6 text-[40px] font-roboto font-semibold backdrop-blur-[100px] transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'linear-gradient(0deg, rgba(203, 175, 135, 0.3), rgba(203, 175, 135, 0.3)), linear-gradient(0deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))'
              }}
              disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
            >
              {isLoading ? "Updating..." : "Confirm"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordNewPasswordForm;
