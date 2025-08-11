import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { getAccessToken, clearAuthData } from './utils';

// Configuration constants
const API_BASE_URL = 'http://localhost:5000'; // Adjust port if needed
const DEFAULT_TIMEOUT = 5000; // 5 seconds timeout (reduced from 10)

// Type definitions for API responses
export interface ApiResponse {
  message?: string;
  success?: boolean;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Create and configure an axios instance with interceptors
 * The response interceptor transforms responses to return data directly
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: DEFAULT_TIMEOUT,
  });

  // Request interceptor to add authorization header
  client.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors and extract data
  client.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      // Return the data directly for successful responses
      return response.data;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          try {
            // Clear local auth immediately on 401
            clearAuthData();
          } catch {}
          // Redirect to login without throwing noisy errors
          // Use location to avoid hook context here
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search;
            const loginUrl = '/auth/login';
            if (!currentPath.startsWith('/auth')) {
              window.location.replace(loginUrl);
            }
          }
        }
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `HTTP error! status: ${error.response.status}`;
        console.error('API request failed:', errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.message);
        throw new Error('Network error');
      } else {
        // Something else happened
        console.error('API request failed:', error.message);
        throw error;
      }
    }
  );

  return client;
}

// Create the configured axios instance
export const apiClient = createApiClient();

/**
 * Generic API request helper function
 * @param endpoint - The API endpoint to call
 * @param options - Axios request configuration options
 * @returns Promise with the response data
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    // The response interceptor transforms the response to return data directly
    const result = await apiClient.request<T>({
      url: endpoint,
      ...options,
    });
    // Due to our response interceptor, this actually returns T, not AxiosResponse<T>
    return result as unknown as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Convenience methods for common HTTP operations
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiRequest<T>(url, { ...config, method: 'GET' }),

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiRequest<T>(url, { ...config, method: 'POST', data }),

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiRequest<T>(url, { ...config, method: 'PUT', data }),

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiRequest<T>(url, { ...config, method: 'PATCH', data }),

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiRequest<T>(url, { ...config, method: 'DELETE' }),
};

// Export the configured client as default for direct axios usage if needed
export default apiClient;
