import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use AuthContext instead of maintaining separate state
  const { 
    user,
    isLoading, 
    error,
    isAuthenticated,
    login: contextLogin,
    logout: contextLogout,
    sendForgotPasswordEmail: contextSendForgotPasswordEmail,
    forgotPasswordVerify: contextForgotPasswordVerify,
    forgotPasswordReset: contextForgotPasswordReset,
    clearError: contextClearError,
    forgotPasswordEmail,
    forgotPasswordStep
  } = useAuth();

  // Forgot password flow state is now managed by AuthContext

  // Login function - wrapper around AuthContext login with navigation
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      console.log('useAuthFlow: Delegating login to AuthContext for user:', credentials.username);
      // Use the login from AuthContext
      await contextLogin(credentials);
      
      // After successful login, navigate to intended destination or home
      console.log('useAuthFlow: Login successful, navigating to home');
      const from = location.state?.from || '/home';
      navigate(from, { replace: true });
      
      return true;
    } catch (error: any) {
      console.error('useAuthFlow: Login failed:', error);
      throw error;
    }
  }, [navigate, contextLogin, location.state]);

  // Logout function - wrapper around AuthContext logout with navigation
  const logout = useCallback(async () => {
    try {
      // Use the logout from AuthContext
      await contextLogout();
      
      // Navigate to login page
      navigate('/auth/login');
    } catch (error) {
      console.error('useAuthFlow: Logout error:', error);
    }
  }, [navigate, contextLogout]);

  // Forgot password - send email - wrapper around AuthContext method with navigation
  const sendForgotPasswordEmailWithNav = useCallback(async (email: string) => {
    try {
      // Use the sendForgotPasswordEmail from AuthContext
      await contextSendForgotPasswordEmail(email);
      
      // Navigate to verification step
      navigate('/auth/forget-password/verify');
    } catch (error: any) {
      console.error('useAuthFlow: Send forgot password email failed:', error);
      throw error;
    }
  }, [navigate, contextSendForgotPasswordEmail]);

  // Forgot password - verify code - wrapper around AuthContext method with navigation
  const forgotPasswordVerify = useCallback(async (verificationCode: string) => {
    try {
      // Use the forgotPasswordVerify from AuthContext
      await contextForgotPasswordVerify(verificationCode);
      
      // Navigate to new password step
      navigate('/auth/forget-password/new-password');
    } catch (error: any) {
      console.error('useAuthFlow: Verify code failed:', error);
      throw error;
    }
  }, [navigate, contextForgotPasswordVerify]);

  // Forgot password - reset password - wrapper around AuthContext method with navigation
  const forgotPasswordReset = useCallback(async (newPassword: string) => {
    try {
      // Use the forgotPasswordReset from AuthContext
      await contextForgotPasswordReset(newPassword);
      
      // Navigate to login with success message
      navigate('/auth/login');
    } catch (error: any) {
      console.error('useAuthFlow: Reset password failed:', error);
      throw error;
    }
  }, [navigate, contextForgotPasswordReset]);

  // Check if user is authenticated (for route guards) - directly use isAuthenticated from context
  const checkAuth = useCallback(() => {
    return isAuthenticated;
  }, [isAuthenticated]);

  return {
    // Auth state - directly from AuthContext
    user,
    isLoading,
    error,
    isAuthenticated,

    // Forgot password state - directly from AuthContext
    forgotPasswordEmail,
    forgotPasswordStep,

    // Auth actions - wrapped for navigation
    login,
    logout,

    // Forgot password actions - wrapped for navigation
    sendForgotPasswordEmail: sendForgotPasswordEmailWithNav,
    forgotPasswordVerify,
    forgotPasswordReset,

    // Utility functions
    checkAuth,
    clearError: contextClearError,
  };
};

export default useAuthFlow;
