import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/auth/AuthPage';

const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default auth route redirects to login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Login route */}
      <Route path="/login" element={<AuthPage />} />

      {/* Forgot password routes - multi-step flow */}
      <Route path="/forget-password/email" element={<AuthPage />} />
      <Route path="/forget-password/verify" element={<AuthPage />} />
      <Route path="/forget-password/new-password" element={<AuthPage />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
