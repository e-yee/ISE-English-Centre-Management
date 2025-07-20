"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import classroomBG from "../../assets/classroomBG.svg";
import logoSvg from "../../assets/logo.svg";

type AuthView = "login" | "forgot-email" | "forgot-verify" | "forgot-new-password";

const AuthPageDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data states
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [emailInput, setEmailInput] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });

  // Mock handlers for demo purposes
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Demo login attempt:", { username, password });
      alert(`Demo login attempt:\nUsername: ${username}\nPassword: ${password}`);
    }, 1000);
  };

  const handleForgotPasswordEmail = (email: string) => {
    setIsLoading(true);
    setError(null);
    setForgotPasswordEmail(email);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView("forgot-verify");
      console.log("Demo forgot password email:", email);
    }, 1000);
  };

  const handleForgotPasswordVerify = (verificationCode: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView("forgot-new-password");
      console.log("Demo verification code:", verificationCode);
    }, 1000);
  };

  const handleForgotPasswordReset = (newPassword: string, confirmPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView("login");
      console.log("Demo password reset:", { newPassword, confirmPassword });
      alert("Password reset successful! (Demo)");
    }, 1000);
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
    setError(null);
  };

  const handleForgotPassword = () => {
    setCurrentView("forgot-email");
    setError(null);
  };

  const renderCurrentForm = () => {
    switch (currentView) {
      case "login":
        return (
          <Card className="w-full bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-roboto">
            <CardHeader className="text-center pb-6">
              {/* Logo - Made bigger */}
              <div className="flex justify-center mb-4">
                <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
              </div>

              {/* Welcome Text - Minimized */}
              <CardTitle className="text-[60px] font-roboto font-semibold text-[#78746C] leading-[1.4]">
                WELCOME
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-12 pb-12">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(loginData.username, loginData.password); }} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block text-[30px] font-roboto font-semibold text-[#000000] text-left leading-[1.4]">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-transparent border-0 border-b border-black rounded-none px-0 py-1 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder=""
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2 relative">
                  <label className="block text-[30px] font-roboto font-semibold text-[#000000] text-left leading-[1.4]">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-transparent border-0 border-b border-black rounded-none px-0 py-1 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder=""
                    required
                    disabled={isLoading}
                  />

                  {/* Forgot Password Link - Positioned to the right, below password field */}
                  <div className="absolute right-0 top-full mt-2">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[25px] font-roboto font-medium text-[rgba(0,0,0,0.65)] hover:underline leading-[1.4]"
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
                    className="relative w-full h-[88px] bg-[rgba(203,175,135,0.3)] text-[#000000] hover:bg-[rgba(203,175,135,0.4)] border-2 border-black rounded-full font-roboto font-semibold transition-all duration-200 disabled:opacity-50"
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
      case "forgot-email":
        return (
          <Card className="w-full bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-roboto">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
              </div>
              <CardTitle className="text-[50px] font-roboto font-semibold text-[#78746C] leading-[1.4]">
                FORGOT PASSWORD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-12 pb-12">
              <form onSubmit={(e) => { e.preventDefault(); handleForgotPasswordEmail(emailInput); }} className="space-y-8">
                <p className="text-[20px] font-roboto text-[#78746C] text-center leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <div className="space-y-4">
                  <label className="block text-[30px] font-roboto font-semibold text-[#121212] text-center">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    onClick={handleBackToLogin}
                    className="flex-1 bg-transparent text-[#121212] hover:bg-[rgba(0,0,0,0.1)] border-2 border-black rounded-[30px] py-4 text-[25px] font-roboto font-medium transition-all duration-200"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[rgba(203,175,135,0.3)] text-[#121212] hover:bg-[rgba(203,175,135,0.5)] border-2 border-black rounded-[30px] py-4 text-[25px] font-roboto font-semibold backdrop-blur-[100px] transition-all duration-200 disabled:opacity-50"
                    disabled={isLoading || !emailInput.trim()}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );
      case "forgot-verify":
        return (
          <Card className="w-full bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-roboto">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
              </div>
              <CardTitle className="text-[50px] font-roboto font-semibold text-[#78746C] leading-[1.4]">
                VERIFY CODE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-12 pb-12">
              <form onSubmit={(e) => { e.preventDefault(); handleForgotPasswordVerify(verificationCode); }} className="space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-[20px] font-roboto text-[#78746C] leading-relaxed">
                    Enter the verification code sent to
                  </p>
                  <p className="text-[22px] font-roboto font-semibold text-[#121212]">{forgotPasswordEmail}</p>
                </div>
                <div className="space-y-4">
                  <label className="block text-[30px] font-roboto font-semibold text-[#121212] text-center">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 text-center tracking-widest"
                    placeholder="Enter verification code"
                    required
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>
                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    onClick={handleBackToLogin}
                    className="flex-1 bg-transparent text-[#121212] hover:bg-[rgba(0,0,0,0.1)] border-2 border-black rounded-[30px] py-4 text-[25px] font-roboto font-medium transition-all duration-200"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[rgba(203,175,135,0.3)] text-[#121212] hover:bg-[rgba(203,175,135,0.5)] border-2 border-black rounded-[30px] py-4 text-[25px] font-roboto font-semibold backdrop-blur-[100px] transition-all duration-200 disabled:opacity-50"
                    disabled={isLoading || !verificationCode.trim()}
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );
      case "forgot-new-password":
        return (
          <Card className="w-full bg-[#EFECE7] border-black border-2 rounded-[30px] shadow-[10px_4px_4px_0px_rgba(0,0,0,0.25)] font-roboto">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img src={logoSvg} alt="Logo" className="w-48 h-auto" />
              </div>
              <CardTitle className="text-[50px] font-roboto font-semibold text-[#78746C] leading-[1.4]">
                NEW PASSWORD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-12 pb-12">
              <form onSubmit={(e) => { e.preventDefault(); handleForgotPasswordReset(passwordData.newPassword, passwordData.confirmPassword); }} className="space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-[20px] font-roboto text-[#78746C] leading-relaxed">
                    Enter your new password for
                  </p>
                  <p className="text-[22px] font-roboto font-semibold text-[#121212]">{forgotPasswordEmail}</p>
                </div>
                <div className="space-y-4">
                  <label className="block text-[30px] font-roboto font-semibold text-[#121212] text-center">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[30px] font-roboto font-semibold text-[#121212] text-center">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-transparent border-0 border-b-2 border-black rounded-none px-0 py-2 text-[25px] font-roboto text-[#121212] placeholder-[#78746C] focus:ring-0 focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-[rgba(203,175,135,0.3)] text-[#121212] hover:bg-[rgba(203,175,135,0.5)] border-2 border-black rounded-[30px] py-6 text-[40px] font-roboto font-semibold backdrop-blur-[100px] transition-all duration-200 disabled:opacity-50"
                    disabled={isLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {isLoading ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F5F5]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap');`}
      </style>

      <div className="flex h-full">
        {/* Left Half - Auth Form */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-[#F5F5F5] relative">
          {error && (
            <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20">
              {error}
            </div>
          )}
          <div className="w-full max-w-lg">
            {renderCurrentForm()}
          </div>
        </div>

        {/* Right Half - Background Image */}
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${classroomBG})`,
          }}
        >
          {/* Optional overlay for better image presentation */}
          <div className="w-full h-full bg-black/5"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPageDemo;
