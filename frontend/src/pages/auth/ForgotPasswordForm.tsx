"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onConfirm?: () => void;
}

export function ForgotPasswordForm({ onBackToLogin, onConfirm }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Step 1: Send verification code to email
      console.log("Sending verification code to:", formData.email);
      // Add your email sending logic here
      setStep(2);
    } else if (step === 2) {
      // Step 2: Verify code and proceed to password reset
      console.log("Verifying code:", formData.verificationCode, "for email:", formData.email);
      // Add your verification logic here
      setStep(3);
    } else {
      // Step 3: Save new password and navigate to dashboard
      console.log("Setting new password for:", formData.email, "New password:", formData.newPassword);
      // Add your password update logic here
      if (onConfirm) {
        onConfirm();
      }
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
        <form onSubmit={handleForgotPassword} className="space-y-6">
          {/* Step 1 & 2: Form inputs */}
          {step !== 3 && (
            <>
              <div className="space-y-2 text-center">
                <p className="text-[22px] text-black">Forget Password:</p>
                <p className="text-[15px] text-black">Enter your email to receive verification code</p>
              </div>

              <div className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1">
                  {step === 2 && (
                    <label htmlFor="email" className="text-[15px] text-black opacity-50 block">
                      Email
                    </label>
                  )}
                  <Input
                    id="email"
                    type="email"
                    placeholder={step === 1 ? "Email" : ""}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
                    required
                    readOnly={step === 2}
                  />
                </div>

                {/* Verification Code Input - Only show in step 2 */}
                {step === 2 && (
                  <div className="space-y-1">
                    <label htmlFor="verificationCode" className="text-[20px] text-black opacity-50 block">
                      Verification Code
                    </label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder=""
                      value={formData.verificationCode}
                      onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                      className="h-12 rounded-[20px] border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
                      required
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 3: New password input */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-[22px] text-black">Enter your new password:</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="newPassword" className="text-[20px] text-black opacity-50 block">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder=""
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="h-12 rounded-[20px] border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500 focus:border-black focus:ring-0"
                    required
                  />
                </div>

                <p className="text-[20px] text-left opacity-50 text-black">
                  Enter "Confirm" button to save your new password
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            {step !== 3 && (
              <Button
                variant="link"
                type="button"
                onClick={onBackToLogin}
                className="text-black text-[25px] opacity-70 hover:underline p-0"
              >
                Back to login
              </Button>
            )}
            <Button
              type="submit"
              className="bg-[#7181DD] hover:bg-[#5A6ACF] text-black text-[30px] px-8 py-6 rounded-[30px] border-2 border-black leading-none"
            >
              {step === 1 ? "Send" : step === 2 ? "Verify" : "Confirm"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
