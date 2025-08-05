import React, { createContext, useContext, useReducer, useEffect, useMemo, type ReactNode } from 'react';
import authService from '../services/auth/authService';
import { setUser } from '../lib/utils';
import { 
  isAuthenticated, 
  getUser, 
  getUserRole,
  getUserIdFromToken,
  getEmployeeIdFromToken
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

interface NavigationCallbacks {
  navigate: (path: string) => void;
  replace?: (path: string) => void;
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
  clearError: () => void;
  
  // Forgot password state
  forgotPasswordEmail: string;
  forgotPasswordStep: 1 | 2 | 3;
  
  // Navigation callbacks
  setNavigationCallbacks: (callbacks: NavigationCallbacks) => void;
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
  isLoading: true, // Start with loading true to prevent race condition
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
      return {
        ...initialState,
        isLoading: false, // Ensure loading is false after reset
      };
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
  
  // Navigation callbacks state
  const [navigationCallbacks, setNavigationCallbacks] = React.useState<NavigationCallbacks | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Starting auth initialization');
        
        const authenticated = isAuthenticated();
        const user = getUser();
        const role = getUserRole();
        const employeeId = getEmployeeIdFromToken();
        const userId = getUserIdFromToken();
        
        console.log('AuthContext initialization:', {
          authenticated,
          user,
          role,
          userId,
          employeeId
        });
        
        // If authenticated but no user data, create user object from JWT token
        if (authenticated && !user) {
          const userWithRole = {
            id: employeeId || userId || 'unknown',
            username: 'user',
            email: 'user@example.com',
            role: role as 'Teacher' | 'Learning Advisor' | 'Manager'
          };
          console.log('Creating user object from JWT token:', userWithRole);
          dispatch({ type: 'SET_USER', payload: userWithRole });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        } else if (user) {
          // Combine user data with role from localStorage
          const userWithRole = {
            ...user,
            id: employeeId || user.id, // Use employee ID if available
            role: role || user.role || 'Teacher' // Fallback to stored role or default
          };
          console.log('Combining user data with role:', userWithRole);
          dispatch({ type: 'SET_USER', payload: userWithRole });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        } else {
          console.log('No user data available, setting user to null');
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      } finally {
        console.log('AuthContext: Auth initialization complete, setting loading to false');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Navigation helper function
  const navigateTo = (path: string) => {
    if (navigationCallbacks?.navigate) {
      console.log('Using React Router navigation to:', path);
      navigationCallbacks.navigate(path);
    } else {
      console.log('Using window.location.href fallback to:', path);
      window.location.href = path;
    }
  };

  // Login function
  const login = async (credentials: { username: string; password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      console.log('Attempting login for user:', credentials.username);
      const response = await authService.login(credentials);

      console.log('Login successful for user:', credentials.username);

      // Get role and employee ID from JWT token
      const role = getUserRole();
      const employeeId = getEmployeeIdFromToken();
      const userId = getUserIdFromToken();
      
      console.log('Login data from JWT:', {
        role,
        employeeId,
        userId
      });

      // Create user object with employee ID
      const userWithRole = {
        id: employeeId || userId || 'unknown',
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        role: role as 'Teacher' | 'Learning Advisor' | 'Manager'
      };

      console.log('Created user object:', userWithRole);

      // IMPORTANT: Save user data to localStorage before redirecting
      setUser(userWithRole);
      
      // Update React state
      dispatch({ type: 'SET_USER', payload: userWithRole });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_LOADING', payload: false });

      // Navigate to role-appropriate page after successful login
      const defaultRoute = getDefaultRouteForRole(role || 'Teacher');
      navigateTo(defaultRoute);

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
      // Clear auth data first
      await authService.logout();
      
      // Reset state before navigation to prevent race conditions
      dispatch({ type: 'RESET_AUTH_STATE' });
      
      // Small delay to ensure state is properly reset before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear any lingering focus and navigate
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      // Force focus to body to prevent focus issues
      document.body.focus();
      
      navigateTo('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      dispatch({ type: 'RESET_AUTH_STATE' });
      
      // Clear focus and navigate
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.focus();
      
      navigateTo('/auth/login');
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
      
      navigateTo('/auth/forget-password/verify');
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
      
      navigateTo('/auth/forget-password/new-password');
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
      
      navigateTo('/auth/login');
      
      alert('Password reset successful! Please login with your new password.');
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to reset password' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Check if user is authenticated (for route guards)
  const checkAuth = () => {
    const authenticated = isAuthenticated();
    console.log('AuthContext checkAuth:', {
      authenticated,
      user: authState.user,
      isLoading: authState.isLoading
    });
    return authenticated;
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue: AuthContextType = useMemo(() => ({
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
    clearError,
    
    // Navigation callbacks
    setNavigationCallbacks,
  }), [
    authState.user,
    authState.isLoading,
    authState.error,
    authState.isAuthenticated,
    forgotPasswordState.email,
    forgotPasswordState.step,
    login,
    logout,
    sendForgotPasswordEmail,
    forgotPasswordVerify,
    forgotPasswordReset,
    checkAuth,
    clearError,
    setNavigationCallbacks,
  ]);

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