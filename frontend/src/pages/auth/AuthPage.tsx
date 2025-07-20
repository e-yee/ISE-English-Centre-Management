"use client";

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthFlow } from "../../hooks/useAuthFlow";
import LoginForm from "../../components/auth/LoginForm";
import ForgotPasswordEmailForm from "../../components/auth/ForgotPasswordEmailForm";
import ForgotPasswordVerifyForm from "../../components/auth/ForgotPasswordVerifyForm";
import ForgotPasswordNewPasswordForm from "../../components/auth/ForgotPasswordNewPasswordForm";
import classroomBG from "../../assets/classroomBG.svg";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    login,
    sendForgotPasswordEmail,
    forgotPasswordVerify,
    forgotPasswordReset,
    forgotPasswordEmail: storedEmail,
    isLoading,
    error
  } = useAuthFlow();

  // Determine current form based on route
  const getCurrentForm = () => {
    const path = location.pathname;

    if (path === "/auth/login") {
      return "login";
    } else if (path === "/auth/forget-password/email") {
      return "forgot-email";
    } else if (path === "/auth/forget-password/verify") {
      return "forgot-verify";
    } else if (path === "/auth/forget-password/new-password") {
      return "forgot-new-password";
    }

    // Default to login
    return "login";
  };

  const currentForm = getCurrentForm();

  //=============================Uncomment this for route protection==================

  // // Route protection - ensure users follow the correct flow
  // useEffect(() => {
  //   const path = location.pathname;

  //   // If user is on verify or new-password step but doesn't have an email, redirect to email step
  //   if ((path === "/auth/forget-password/verify" || path === "/auth/forget-password/new-password") && !storedEmail) {
  //     navigate("/auth/forget-password/email");
  //   }
  // }, [location.pathname, storedEmail, navigate]);

  //=============================Uncomment this for route protection==================

  // Navigation handlers
  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  const handleForgotPassword = () => {
    navigate("/auth/forget-password/email");
  };

  // Form submission handlers
  const handleLogin = async (username: string, password: string) => {
    try {
      await login({ username, password });
      // Navigation will be handled by the useAuthFlow hook
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleForgotPasswordEmailSubmit = async (email: string) => {
    try {
      await sendForgotPasswordEmail(email);
      navigate("/auth/forget-password/verify");
    } catch (error) {
      console.error("Failed to send verification code:", error);
    }
  };

  const handleForgotPasswordVerifySubmit = async (verificationCode: string) => {
    try {
      await forgotPasswordVerify(verificationCode);
      navigate("/auth/forget-password/new-password");
    } catch (error) {
      console.error("Failed to verify code:", error);
    }
  };

  const handleForgotPasswordNewPasswordSubmit = async (newPassword: string) => {
    try {
      await forgotPasswordReset(newPassword);
      // Show success message and redirect to login
      alert("Password reset successful! Please log in with your new password.");
      navigate("/auth/login");
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  // Render current form
  const renderCurrentForm = () => {
    switch (currentForm) {
      case "login":
        return (
          <LoginForm
            onForgotPassword={handleForgotPassword}
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        );

      case "forgot-email":
        return (
          <ForgotPasswordEmailForm
            onBackToLogin={handleBackToLogin}
            onSubmit={handleForgotPasswordEmailSubmit}
            initialEmail={storedEmail}
            isLoading={isLoading}
          />
        );

      case "forgot-verify":
        return (
          <ForgotPasswordVerifyForm
            onBackToLogin={handleBackToLogin}
            onSubmit={handleForgotPasswordVerifySubmit}
            email={storedEmail}
            isLoading={isLoading}
          />
        );

      case "forgot-new-password":
        return (
          <ForgotPasswordNewPasswordForm
            onSubmit={handleForgotPasswordNewPasswordSubmit}
            email={storedEmail}
            isLoading={isLoading}
          />
        );

      default:
        return (
          <LoginForm
            onForgotPassword={handleForgotPassword}
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        );
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

export default AuthPage;
