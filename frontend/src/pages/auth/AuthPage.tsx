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
    error,
    isAuthenticated, // Add this to get authentication status
    user
  } = useAuthFlow();
  
  // Redirect authenticated users to home page
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('AuthPage: User already authenticated, redirecting to home');
      navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

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

  // Route protection - ensure users follow the correct flow
  // useEffect(() => {
  //   const path = location.pathname;

  //   // If user is on verify or new-password step but doesn't have an email, redirect to email step
  //   if ((path === "/auth/forget-password/verify" || path === "/auth/forget-password/new-password") && !storedEmail) {
  //     navigate("/auth/forget-password/email");
  //   }
  // }, [location.pathname, storedEmail, navigate]);

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
    <div className="h-screen w-screen overflow-hidden bg-[#F5F5F5] font-comfortaa">
      <div className="flex h-full">
        {/* Left Half - Auth Form */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-[#F5F5F5] relative">
          {error && (
            <div className="absolute top-4 right-4 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg shadow-md z-20 max-w-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
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
