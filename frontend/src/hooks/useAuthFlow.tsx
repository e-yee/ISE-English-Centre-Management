import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { 
  isAuthenticated, 
  getUser, 
  clearAuthData,
  getAccessToken 
} from '../lib/utils';

// Authentication state interface
interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Forgot password flow state
interface ForgotPasswordState {
  email: string;
  verificationCode: string;
  step: 1 | 2 | 3;
}

export const useAuthFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Authentication state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  // Forgot password flow state
  const [forgotPasswordState, setForgotPasswordState] = useState<ForgotPasswordState>({
    email: '',
    verificationCode: '',
    step: 1,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const authenticated = isAuthenticated();
      const user = getUser();
      
      setAuthState({
        user: authenticated ? user : null,
        isLoading: false,
        error: null,
        isAuthenticated: authenticated,
      });
    };

    initializeAuth();
  }, []);

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setAuthState(prev => ({ ...prev, error }));
  }, []);

  // Login function
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting login for user:', credentials.username);
      const response = await authService.login(credentials);

      console.log('Login successful for user:', credentials.username);

      setAuthState({
        user: response.user || null,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });

      // Navigate to intended destination or home page after successful login
      const from = location.state?.from || '/home';
      navigate(from, { replace: true });

      return response;
    } catch (error: any) {
      console.error('Login failed for user:', credentials.username, 'Error:', error.message);

      // Set user-friendly error message
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);

      // Log additional error details for debugging
      if (error.name === 'AuthenticationError') {
        console.warn('Authentication error:', errorMessage);
      } else {
        console.error('Unexpected login error:', error);
      }

      throw error;
    }
  }, [navigate, setLoading, setError]);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
      
      // Navigate to login page
      navigate('/auth/login');
    }
  }, [navigate, setLoading]);

  // Forgot password - send email
  const forgotPasswordEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.forgotPasswordEmail(email);
      
      setForgotPasswordState(prev => ({
        ...prev,
        email,
        step: 2,
      }));

      setLoading(false);
      
      // Navigate to verification step
      navigate('/auth/forget-password/verify');
    } catch (error: any) {
      setError(error.message || 'Failed to send verification email');
      setLoading(false);
      throw error;
    }
  }, [navigate, setLoading, setError]);

  // Forgot password - verify code
  const forgotPasswordVerify = useCallback(async (verificationCode: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.forgotPasswordVerify(forgotPasswordState.email, verificationCode);
      
      setForgotPasswordState(prev => ({
        ...prev,
        verificationCode,
        step: 3,
      }));

      setLoading(false);
      
      // Navigate to new password step
      navigate('/auth/forget-password/new-password');
    } catch (error: any) {
      setError(error.message || 'Invalid verification code');
      setLoading(false);
      throw error;
    }
  }, [forgotPasswordState.email, navigate, setLoading, setError]);

  // Forgot password - reset password
  const forgotPasswordReset = useCallback(async (newPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.forgotPasswordReset(
        forgotPasswordState.email,
        forgotPasswordState.verificationCode,
        newPassword
      );

      // Reset forgot password state
      setForgotPasswordState({
        email: '',
        verificationCode: '',
        step: 1,
      });

      setLoading(false);
      
      // Navigate to login with success message
      navigate('/auth/login');
      
      // You might want to show a success message here
      alert('Password reset successful! Please login with your new password.');
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
      setLoading(false);
      throw error;
    }
  }, [forgotPasswordState, navigate, setLoading, setError]);

  // Check if user is authenticated (for route guards)
  const checkAuth = useCallback(() => {
    return isAuthenticated();
  }, []);

  // Refresh token if needed
  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [logout]);

  return {
    // Auth state
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    isAuthenticated: authState.isAuthenticated,

    // Forgot password state
    forgotPasswordEmail: forgotPasswordState.email,
    forgotPasswordStep: forgotPasswordState.step,

    // Auth actions
    login,
    logout,

    // Forgot password actions
    sendForgotPasswordEmail: forgotPasswordEmail,
    forgotPasswordVerify,
    forgotPasswordReset,

    // Utility functions
    checkAuth,
    refreshToken,
    clearError: () => setError(null),
  };
};

export default useAuthFlow;
