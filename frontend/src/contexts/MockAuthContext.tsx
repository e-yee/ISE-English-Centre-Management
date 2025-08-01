import React, { createContext, useContext, type ReactNode } from 'react';

// Types (same as AuthContext)
interface User {
  id: string;
  username: string;
  email: string;
  role: 'manager' | 'teacher' | 'learning adviser';
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  // Auth actions (mocked)
  login: (credentials: { username: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  
  // Forgot password actions (mocked)
  sendForgotPasswordEmail: (email: string) => Promise<void>;
  forgotPasswordVerify: (verificationCode: string) => Promise<void>;
  forgotPasswordReset: (newPassword: string) => Promise<void>;
  
  // Utility functions (mocked)
  checkAuth: () => boolean;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  
  // Forgot password state
  forgotPasswordEmail: string;
  forgotPasswordStep: 1 | 2 | 3;
}

// Mock user data
const mockUser: User = {
  id: 'mock-user-1',
  username: 'testteacher',
  email: 'teacher@ise.edu.vn',
  role: 'teacher', // This role has access to /example route
  name: 'Test Teacher',
  avatar: '/default-avatar.png',
};

// Mock authentication state
const mockAuthState: AuthState = {
  user: mockUser,
  isLoading: false,
  error: null,
  isAuthenticated: true, // Always authenticated for testing
};

// Create context
const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock AuthProvider
export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock functions that do nothing but return success
  const login = async (credentials: { username: string; password: string }) => {
    console.log('Mock login:', credentials);
    return { success: true, user: mockUser };
  };

  const logout = async () => {
    console.log('Mock logout');
    return Promise.resolve();
  };

  const sendForgotPasswordEmail = async (email: string) => {
    console.log('Mock send forgot password email:', email);
    return Promise.resolve();
  };

  const forgotPasswordVerify = async (verificationCode: string) => {
    console.log('Mock forgot password verify:', verificationCode);
    return Promise.resolve();
  };

  const forgotPasswordReset = async (newPassword: string) => {
    console.log('Mock forgot password reset:', newPassword);
    return Promise.resolve();
  };

  const checkAuth = () => {
    return true; // Always authenticated
  };

  const refreshToken = async () => {
    console.log('Mock refresh token');
    return Promise.resolve(true);
  };

  const clearError = () => {
    // No errors in mock mode
  };

  const contextValue: AuthContextType = {
    ...mockAuthState,
    login,
    logout,
    sendForgotPasswordEmail,
    forgotPasswordVerify,
    forgotPasswordReset,
    checkAuth,
    refreshToken,
    clearError,
    forgotPasswordEmail: '',
    forgotPasswordStep: 1,
  };

  return (
    <MockAuthContext.Provider value={contextValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Hook to use mock auth context
export const useMockAuth = (): AuthContextType => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

// Alias useAuth to useMockAuth so existing components work without changes
export const useAuth = useMockAuth;