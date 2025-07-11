"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"login" | "forgot">("login");

  const handleConfirmPasswordReset = () => {
    // In a real application, this would navigate to the dashboard
    console.log("Navigating to dashboard...");
    // Example: router.push('/dashboard');
    alert("Password reset successful! Redirecting to dashboard...");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Rhodium+Libre&display=swap');`}
      </style>
      <Header/>

      <main className="flex flex-grow items-center justify-center p-4">
        {currentView === "login" ? (
          <LoginForm onForgotPassword={() => setCurrentView("forgot")} />
        ) : (
          <ForgotPasswordForm
            onBackToLogin={() => setCurrentView("login")}
            onConfirm={handleConfirmPasswordReset}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
