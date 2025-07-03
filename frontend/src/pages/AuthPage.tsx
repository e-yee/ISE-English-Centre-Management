"use client";

import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"login" | "forgot">("login");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Rhodium+Libre&display=swap');`}
      </style>
      <Header />

      <main className="flex flex-grow items-center justify-center p-4">
        {currentView === "login" ? (
          <LoginForm onForgotPassword={() => setCurrentView("forgot")} />
        ) : (
          <ForgotPasswordForm onBackToLogin={() => setCurrentView("login")} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
