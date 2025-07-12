"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px] shadow-lg font-['Rhodium_Libre']">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-[57px] font-normal text-[#121212] leading-tight">
          HAMMER & GRAMMAR
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-8 pb-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="h-12 rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
              required
              disabled={isLoading}
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="h-12 rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="link"
              type="button"
              onClick={onForgotPassword}
              className="text-black text-[22px] hover:underline p-0"
              disabled={isLoading}
            >
              Forget Password
            </Button>
            <Button
              type="submit"
              className="bg-[#7181DD] hover:bg-[#5A6ACF] text-black text-[30px] px-8 py-6 rounded-[30px] border-2 border-black leading-none disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
