import { apiRequest } from '../../lib/apiClient';
import {
  setAccessToken,
  clearAuthData,
  setUser,
  setUserRole,
  clearUserRole,
  decodeJWT,
  getAccessToken
} from '../../lib/utils';

// Type definitions for API responses
interface LoginResponse {
  access_token?: string;
  user?: any;
  message?: string;
}

interface ApiResponse {
  message?: string;
  success?: boolean;
}

// Authentication Service
export const authService = {
  /**
   * Extract user role from JWT token
   */
  extractRoleFromToken(): string | null {
    try {
      const token = getAccessToken();
      if (!token) return null;
      
      const payload = decodeJWT(token);
      console.log('JWT payload:', payload);
      console.log('Role from token:', payload?.role);
      return payload?.role || null;
    } catch (error) {
      console.error('Failed to extract role from token:', error);
      return null;
    }
  },

  /**
   * Login user with username and password
   */
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    try {
      const response: LoginResponse = await apiRequest('auth/login', {
        method: 'POST',
        data: credentials,
      });

      // Store tokens
      if (response.access_token) {
        setAccessToken(response.access_token);
      }
      if (response.user) {
        setUser(response.user);
      }

      // Extract and store user role from token
      const role = this.extractRoleFromToken();
      if (role) {
        setUserRole(role);
      } else {
        console.warn('No role found in token, using default');
        setUserRole('Teacher'); // Fallback to default role
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
      await apiRequest('/auth/logout', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local auth data
      clearAuthData();
      clearUserRole(); // Clear role too
      
      // Additional cleanup to ensure all auth-related data is cleared
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      sessionStorage.clear(); // Clear any session data
      
      // Clear any potential focus issues
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.focus();
    }
  },

  /**
   * Request password reset by sending email
   */
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
      const response: ApiResponse = await apiRequest('auth/request_reset', {
        method: 'POST',
        data: { email },
        timeout: 20000,
      });

      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  },

  /**
   * Reset password using token from email link
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response: ApiResponse = await apiRequest(`auth/reset?token=${token}`, {
        method: 'PUT',
        data: { new_password: newPassword },
        timeout: 20000,
      });

      return response;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  },
};

export default authService;
