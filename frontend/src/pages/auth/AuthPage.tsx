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
    forgotPasswordEmail: storedEmail,
    isLoading,
    error,
    isAuthenticated, // Add this to get authentication status
    user,
    success
  } = useAuthFlow();
  
  // Redirect authenticated users to home page
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      if (user.role === 'Manager' || user.role === 'Learning Advisor') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Cleanup effect to ensure proper focus management after logout
  useEffect(() => {
    // Clear any lingering focus when AuthPage mounts
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Force focus to body to prevent focus issues
    document.body.focus();
    
    // Remove any potential focus traps
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body && activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  }, []);

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
      // Don't navigate - stay on same page to show success message
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
  };

  const handleForgotPasswordVerifySubmit = async (verificationCode: string) => {
    // This method is no longer needed with the new flow
    console.warn("Verification step removed in new password reset flow");
  };

  const handleForgotPasswordNewPasswordSubmit = async (newPassword: string) => {
    // This method is no longer needed with the new flow
    console.warn("New password step removed in new password reset flow");
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
            success={success}
            error={error}
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
    <div className="h-screen w-screen flex flex-row justify-start font-comfortaa bg-auto bg-no-repeat bg-right" style={{
        backgroundImage: `url(${classroomBG})`,}}>                   
        {/* Error notification */}
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

        {/* Form */}
        <div className="w-[41%] h-full">
          {renderCurrentForm()}
        </div>         

        {/*Right side*/}
        <div className="w-1/2 px-10 py-5 grow">
          <div className="w-auto h-[100%] rounded-lg 
                          backdrop-blur-none bg-white/10 border border-gray-500/40 border-1 
                          shadow-lg px-10 py-8 text-white
                          flex flex-col items-center gap-4">
            <h1 className="text-5xl font-semibold">Welcome</h1>
            <p className="self-start text-[20px] font-thin">Welcome back! We are glad to have you here - let's get you logged in</p>            
          </div>
        </div>
    </div>
  );
};

export default AuthPage;
