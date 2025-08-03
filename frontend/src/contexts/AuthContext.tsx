import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import authService from '../services/auth/authService';
import { 
  isAuthenticated, 
  getUser, 
  getUserRole,
  getUserIdFromToken
} from '../lib/utils';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  role: 'Teacher' | 'Learning Advisor' | 'Manager'; // 
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface ForgotPasswordState {
  email: string;
  verificationCode: string;
  step: 1 | 2 | 3;
}

interface AuthContextType extends AuthState {
  // Auth actions
  login: (credentials: { username: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  
  // Forgot password actions
  sendForgotPasswordEmail: (email: string) => Promise<void>;
  forgotPasswordVerify: (verificationCode: string) => Promise<void>;
  forgotPasswordReset: (newPassword: string) => Promise<void>;
  
  // Utility functions
  checkAuth: () => boolean;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  
  // Forgot password state
  forgotPasswordEmail: string;
  forgotPasswordStep: 1 | 2 | 3;
}

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_FORGOT_PASSWORD_STATE'; payload: Partial<ForgotPasswordState> }
  | { type: 'RESET_FORGOT_PASSWORD' }
  | { type: 'RESET_AUTH_STATE' };

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'RESET_AUTH_STATE':
      return initialState;
    default:
      return state;
  }
};

// Role-based navigation helper
const getDefaultRouteForRole = (role: string): string => {
  switch (role) {
    case 'Manager':
      return '/home'; // Manager dashboard
    case 'Teacher':
      return '/home'; // Teacher's main page
    case 'Learning Advisor':
      return '/home'; // Learning adviser's main page
    default:
      return '/home';
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const [forgotPasswordState, setForgotPasswordState] = React.useState<ForgotPasswordState>({
    email: '',
    verificationCode: '',
    step: 1,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const authenticated = isAuthenticated();
      const user = getUser();
      const role = getUserRole();
      
      console.log('AuthContext initialization:', {
        authenticated,
        user,
        role,
        userId: getUserIdFromToken()
      });
      
      // If authenticated but no user data, create user object with role
      if (authenticated && !user && role) {
        const userWithRole = {
          id: getUserIdFromToken() || 'unknown',
          username: 'user',
          email: 'user@example.com',
          role: role as 'Teacher' | 'Learning Advisor' | 'Manager'
        };
        console.log('Creating user object with role:', userWithRole);
        dispatch({ type: 'SET_USER', payload: userWithRole });
      } else if (user) {
        // Combine user data with role from localStorage
        const userWithRole = {
          ...user,
          role: role || user.role || 'Teacher' // Fallback to stored role or default
        };
        console.log('Combining user data with role:', userWithRole);
        dispatch({ type: 'SET_USER', payload: userWithRole });
      } else {
        console.log('No user data available, setting user to null');
        dispatch({ type: 'SET_USER', payload: null });
      }
      
      dispatch({ type: 'SET_AUTHENTICATED', payload: authenticated });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: { username: string; password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      console.log('Attempting login for user:', credentials.username);
      const response = await authService.login(credentials);

      console.log('Login successful for user:', credentials.username);

      // Get role from localStorage after login
      const role = getUserRole();
      const userWithRole = response.user ? {
        ...response.user,
        role: role || response.user.role || 'Teacher'
      } : null;

      dispatch({ type: 'SET_USER', payload: userWithRole });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_LOADING', payload: false });

      // Navigate to role-appropriate page after successful login
      const defaultRoute = getDefaultRouteForRole(role || 'Teacher');
      window.location.href = defaultRoute;

      return response;
    } catch (error: any) {
      console.error('Login failed for user:', credentials.username, 'Error:', error.message);

      const errorMessage = error.message || 'Login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });

      if (error.name === 'AuthenticationError') {
        console.warn('Authentication error:', errorMessage);
      } else {
        console.error('Unexpected login error:', error);
      }

      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'RESET_AUTH_STATE' });
      window.location.href = '/auth/login';
    }
  };

  // Forgot password - send email
  const sendForgotPasswordEmail = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await authService.forgotPasswordEmail(email);
      
      setForgotPasswordState(prev => ({
        ...prev,
        email,
        step: 2,
      }));

      dispatch({ type: 'SET_LOADING', payload: false });
      
      window.location.href = '/auth/forget-password/verify';
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to send verification email' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Forgot password - verify code
  const forgotPasswordVerify = async (verificationCode: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await authService.forgotPasswordVerify(forgotPasswordState.email, verificationCode);
      
      setForgotPasswordState(prev => ({
        ...prev,
        verificationCode,
        step: 3,
      }));

      dispatch({ type: 'SET_LOADING', payload: false });
      
      window.location.href = '/auth/forget-password/new-password';
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Invalid verification code' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Forgot password - reset password
  const forgotPasswordReset = async (newPassword: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

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

      dispatch({ type: 'SET_LOADING', payload: false });
      
      window.location.href = '/auth/login';
      
      alert('Password reset successful! Please login with your new password.');
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to reset password' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Check if user is authenticated (for route guards)
  const checkAuth = () => {
    return isAuthenticated();
  };

  // Refresh token if needed
  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue: AuthContextType = {
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
    sendForgotPasswordEmail,
    forgotPasswordVerify,
    forgotPasswordReset,

    // Utility functions
    checkAuth,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 