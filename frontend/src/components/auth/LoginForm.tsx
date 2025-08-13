"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import logoSvg from "../../assets/logo.svg";
import userIcon from "../../assets/landing_page/user.svg"
import keyIcon from "../../assets/landing_page/key.svg"

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
    <Card className="rounded-lg w-full h-full 
                     bg-[#EFECE7] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] 
                     font-comfortaa
                     flex flex-col justify-evenly content-center">
      <CardHeader className="text-center">
        {/* Logo - Made bigger */}
        <div className="flex justify-center">
          <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
        </div>

        {/* Welcome Text - Minimized */}
        <CardTitle className="text-[60px] sm:text-[40px] font-comfortaa font-semibold text-[#78746C] leading-[1.4] select-none pointer-events-none">
          WELCOME
        </CardTitle>
      </CardHeader>

      <CardContent className="px-[11%]">
        <form onSubmit={handleLogin} className="space-y-4 select-none">
          {/* Username Field */}
          <div className="">
            <label
              htmlFor="username"
              className="block text-[22px] font-comfortaa font-bold text-[#000000] text-left leading-[1.4]"
            >
              Username
            </label>
            <div className="flex flex-row items-center
                            border border-black h-9 w-full
                            rounded-sm">
              <div className="h-full px-1 rounded-s-sm">
                <img src={userIcon} alt="User name" className="w-8 h-full py-2"/>                        
              </div>
              <div className="w-px h-6 bg-black"></div>
              <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full
                         bg-transparent border-0 rounded-none 
                         px-0 pl-1 py-0
                         text-[28px] font-comfortaa font-semibold text-black placeholder-[#78746C] placeholder:italic
                         focus:ring-0 focus-visible:ring-0 focus:placeholder:not-italic text-center
                         selection:bg-yellow-100 selection:text-black/80"
              placeholder=""              
              required
              disabled={isLoading}
              />
            </div>            
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-[22px] font-comfortaa font-bold text-[#000000] text-left leading-[1.4]"
            >
              Password
            </label>    
            <div className="flex flex-row items-center
                            border border-black h-9 w-full
                            rounded-sm">
              <div className="h-full px-1 rounded-s-sm">
                <img src={keyIcon} alt="User name" className="w-8 h-full py-2"/>                        
              </div>
              <div className="w-px h-6 bg-black"></div>
              <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full 
                         bg-transparent border-0 rounded-none 
                         px-0 pl-1 py-0 text-[28px] font-comfortaa font-semibold text-black placeholder-[#78746C] placeholder:italic
                         focus:ring-0 focus-visible:ring-0 focus:placeholder:not-italic
                         selection:bg-yellow-100 selection:text-black/80"
              placeholder=""
              required
              disabled={isLoading}
            />
            </div>
                                            
            

            {/* Forgot Password Link - Positioned to the right, below password field */}
            <div className="absolute right-0 top-full mt-2">
              <button
                type="button"
                onClick={onForgotPassword}
                className="cursor-pointer text-[18px] font-comfortaa font-semibold text-[rgba(0,0,0,0.65)] hover:underline leading-[1.4]"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Login Button - Updated with exact Figma specifications */}
          <div className="pt-10 pb-[31px] relative flex justify-center">
            <Button
              type="submit"
              className="cursor-pointer w-[65%] h-[60px] 
                         bg-[rgba(203,175,135,0.3)] text-gray-500
                         hover:bg-[rgba(203,175,135,0.4)] hover:border-1 hover:border-black hover:text-black hover:scale-[102%]
                         rounded-3xl font-comfortaa font-semibold"
              style={{
                backdropFilter: 'blur(50px)',
                background: 'rgba(203, 175, 135, 0.3)'
              }}
              disabled={isLoading}
            >
              <span className="text-[32px] font-semibold leading-[1.4] flex items-center justify-center">
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
