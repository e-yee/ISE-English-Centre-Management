"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <Card className="w-full max-w-md bg-[#B7D5F4] border-[5px] border-black rounded-[30px] shadow-lg font-['Rhodium_Libre']">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-[57px] font-normal text-[#121212] leading-tight">
          HAMMER & GRAMMAR
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-[22px] text-black">Forget Password:</p>
            <p className="text-[15px] text-black">Enter your email to receive verification code</p>
          </div>

          <div className="space-y-4">
            <Input 
              id="email" 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="link"
              type="button"
              onClick={onBackToLogin}
              className="text-black text-[25px] opacity-70 hover:underline p-0"
              disabled={isLoading}
            >
              Back to login
            </Button>
            <Button
              type="submit"
              className="bg-[#7181DD] hover:bg-[#5A6ACF] text-black text-[30px] px-8 py-6 rounded-[30px] border-2 border-black leading-none disabled:opacity-50"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordEmailForm;
