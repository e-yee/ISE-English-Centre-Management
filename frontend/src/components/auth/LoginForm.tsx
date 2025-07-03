"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { username: formData.username, password: formData.password });
    // Add your login logic here
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
            />
            <Input 
              id="password" 
              type="password" 
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="h-12 rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="link"
              type="button"
              onClick={onForgotPassword}
              className="text-black text-[22px] hover:underline p-0"
            >
              Forget Password
            </Button>
            <Button
              type="submit"
              className="bg-[#7181DD] hover:bg-[#5A6ACF] text-black text-[30px] px-8 py-6 rounded-[30px] border-2 border-black leading-none"
            >
              Log in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
