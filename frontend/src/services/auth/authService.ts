import { apiRequest } from '../../lib/apiClient';
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearAuthData,
  setUser
} from '../../lib/utils';

// Type definitions for API responses
interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
  user?: any;
  message?: string;
}

interface RefreshTokenResponse {
  access_token?: string;
  message?: string;
}

interface ApiResponse {
  message?: string;
  success?: boolean;
}

// Authentication Service
export const authService = {
  /**
   * Login user with username and password
   */
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    try {
      const response: LoginResponse = await apiRequest('auth/login', {
        method: 'POST',
        data: credentials,
      });

      // Store tokens and user data
      if (response.access_token) {
        setAccessToken(response.access_token);
      }
      if (response.refresh_token) {
        setRefreshToken(response.refresh_token);
      }
      if (response.user) {
        setUser(response.user);
      }

      return response;
    } catch (error: any) {
      console.error('Login failed:', error);

      // Enhanced error handling with specific error messages
      let errorMessage = 'Login failed. Please try again.';

      if (error.message) {
        const message = error.message.toLowerCase();

        // Check for specific error types
        if (message.includes('invalid credentials') ||
            message.includes('wrong username') ||
            message.includes('wrong password') ||
            message.includes('incorrect username') ||
            message.includes('incorrect password') ||
            message.includes('authentication failed') ||
            message.includes('unauthorized')) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (message.includes('network error') ||
                   message.includes('connection') ||
                   message.includes('timeout')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (message.includes('server error') ||
                   message.includes('internal server error') ||
                   message.includes('500')) {
          errorMessage = 'Server error occurred. Please try again later or contact support.';
        } else if (message.includes('service unavailable') ||
                   message.includes('503')) {
          errorMessage = 'Service is temporarily unavailable. Please try again later.';
        } else {
          // Use the original error message if it's user-friendly
          errorMessage = error.message;
        }
      }

      // Create a new error with the enhanced message
      const enhancedError = new Error(errorMessage);
      enhancedError.name = 'AuthenticationError';
      throw enhancedError;
    }
  },

  /**
   * Logout user and clear all auth data
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if it exists
      await apiRequest('/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local auth data
      clearAuthData();
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response: RefreshTokenResponse = await apiRequest('/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (response.access_token) {
        setAccessToken(response.access_token);
      }

      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear auth data if refresh fails
      clearAuthData();
      throw error;
    }
  },

  /**
   * Send verification code to email for password reset
   */
  async forgotPasswordEmail(email: string): Promise<ApiResponse> {
    try {
      const response: ApiResponse = await apiRequest('/forgot-password/email', {
        method: 'POST',
        data: { email },
      });

      return response;
    } catch (error) {
      console.error('Forgot password email failed:', error);
      throw error;
    }
  },

  /**
   * Verify the code sent to email
   */
  async forgotPasswordVerify(email: string, verificationCode: string): Promise<ApiResponse> {
    try {
      const response: ApiResponse = await apiRequest('/forgot-password/verify', {
        method: 'POST',
        data: { email, verification_code: verificationCode },
      });

      return response;
    } catch (error) {
      console.error('Forgot password verification failed:', error);
      throw error;
    }
  },

  /**
   * Reset password with new password
   */
  async forgotPasswordReset(email: string, verificationCode: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response: ApiResponse = await apiRequest('/forgot-password/reset', {
        method: 'POST',
        data: {
          email,
          verification_code: verificationCode,
          new_password: newPassword
        },
      });

      return response;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  },
};

export default authService;
