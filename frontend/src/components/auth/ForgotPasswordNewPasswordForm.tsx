"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px] shadow-lg font-['Rhodium_Libre']">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-[57px] font-normal text-[#121212] leading-tight">
          HAMMER & GRAMMAR
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-[22px] text-black">Set New Password:</p>
            <p className="text-[15px] text-black">
              Enter your new password for
            </p>
            <p className="text-[15px] text-black font-semibold">{email}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Input 
                id="newPassword" 
                type="password" 
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className="h-12 rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
                required
                disabled={isLoading}
              />
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1 px-4">{errors.newPassword}</p>
              )}
            </div>
            
            <div>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="h-12 rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
                required
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1 px-4">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-[#7181DD] hover:bg-[#5A6ACF] text-black text-[30px] px-8 py-6 rounded-[30px] border-2 border-black leading-none disabled:opacity-50"
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
