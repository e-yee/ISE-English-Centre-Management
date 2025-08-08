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
  success?: string | null;
  error?: string | null;
}

export function ForgotPasswordEmailForm({
  onBackToLogin,
  onSubmit,
  initialEmail = "",
  isLoading = false,
  success = null,
  error = null
}: ForgotPasswordEmailFormProps) {
  const [email, setEmail] = useState(initialEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  return (
    <Card className="w-full h-full mx-auto bg-[#EFECE7] 
                     rounded-lg shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] 
                     font-comfortaa
                     flex flex-col justify-center content-center">
      <CardHeader className="flex flex-col items-center text-center select-none">
        {/* Logo */}
        <div className="">
          <img src={logoSvg} alt="Logo" className="w-auto h-auto" />
        </div>    
        {/*Title*/}  
        <CardTitle className="text-[36px] text-[#78746C] font-comfortaa font-bold pt-10">
          FORGOT PASSWORD
          </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 px-26 pb-12">
        <form onSubmit={handleSubmit} className="space-y-4 select-none">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-[20px] font-comfortaa">
                ✓ {success}
              </div>
              <p className="text-[18px] font-comfortaa text-[#78746C] leading-relaxed">
                Please check your email and click the reset link to continue.
              </p>
            </div>
          ) : (
            <>
              <p className="hidden text-[20px] font-comfortaa text-[#78746C] text-center leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[22px] font-comfortaa font-semibold text-[#121212] text-left"
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
                {error && (
                  <p className="text-red-600 text-[18px] font-comfortaa text-center">{error}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-row justify-center gap-14">
                <Button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-1/5
                             bg-transparent
                             text-[#121212] text-[18px] font-comfortaa font-medium border-1 border-black
                             hover:bg-[rgba(0,0,0,0.1)] hover:scale-102 rounded-xl                              
                             cursor-pointer"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-2/3 bg-orange-200 rounded-xl 
                             text-zinc-500 text-[20px] font-comfortaa font-semibold 
                             hover:bg-orange-300  hover:text-zinc-700 hover:scale-102                             
                             disabled:opacity-50 cursor-pointer"
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordEmailForm;
