import { useCallback, useEffect } from 'react';
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
    forgotPasswordStep,
    setNavigationCallbacks
  } = useAuth();

  // Set up navigation callbacks for AuthContext
  useEffect(() => {
    if (setNavigationCallbacks) {
      console.log('useAuthFlow: Setting up navigation callbacks for AuthContext');
      setNavigationCallbacks({
        navigate: (path: string) => {
          console.log('useAuthFlow: Navigating to:', path);
          navigate(path);
        },
        replace: (path: string) => {
          console.log('useAuthFlow: Replacing with:', path);
          navigate(path, { replace: true });
        }
      });
    }
  }, [navigate, setNavigationCallbacks]);

  // Forgot password flow state is now managed by AuthContext

  // Login function - wrapper around AuthContext login with navigation
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      console.log('useAuthFlow: Delegating login to AuthContext for user:', credentials.username);
      // Use the login from AuthContext
      await contextLogin(credentials);
      
      // Navigation is now handled by AuthContext with React Router
      console.log('useAuthFlow: Login successful, navigation handled by AuthContext');
      
      return true;
    } catch (error: any) {
      console.error('useAuthFlow: Login failed:', error);
      throw error;
    }
  }, [contextLogin]);

  // Logout function - wrapper around AuthContext logout with navigation
  const logout = useCallback(async () => {
    try {
      // Use the logout from AuthContext
      await contextLogout();
      
      // Navigation is now handled by AuthContext with React Router
      console.log('useAuthFlow: Logout successful, navigation handled by AuthContext');
    } catch (error) {
      console.error('useAuthFlow: Logout error:', error);
    }
  }, [contextLogout]);

  // Forgot password - send email - wrapper around AuthContext method with navigation
  const sendForgotPasswordEmailWithNav = useCallback(async (email: string) => {
    try {
      // Use the sendForgotPasswordEmail from AuthContext
      await contextSendForgotPasswordEmail(email);
      
      // Navigation is now handled by AuthContext with React Router
      console.log('useAuthFlow: Send forgot password email successful, navigation handled by AuthContext');
    } catch (error: any) {
      console.error('useAuthFlow: Send forgot password email failed:', error);
      throw error;
    }
  }, [contextSendForgotPasswordEmail]);

  // Forgot password - verify code - wrapper around AuthContext method with navigation
  const forgotPasswordVerify = useCallback(async (verificationCode: string) => {
    try {
      // Use the forgotPasswordVerify from AuthContext
      await contextForgotPasswordVerify(verificationCode);
      
      // Navigation is now handled by AuthContext with React Router
      console.log('useAuthFlow: Verify code successful, navigation handled by AuthContext');
    } catch (error: any) {
      console.error('useAuthFlow: Verify code failed:', error);
      throw error;
    }
  }, [contextForgotPasswordVerify]);

  // Forgot password - reset password - wrapper around AuthContext method with navigation
  const forgotPasswordReset = useCallback(async (newPassword: string) => {
    try {
      // Use the forgotPasswordReset from AuthContext
      await contextForgotPasswordReset(newPassword);
      
      // Navigation is now handled by AuthContext with React Router
      console.log('useAuthFlow: Reset password successful, navigation handled by AuthContext');
    } catch (error: any) {
      console.error('useAuthFlow: Reset password failed:', error);
      throw error;
    }
  }, [contextForgotPasswordReset]);

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
