import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Authentication Token Management Utilities

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Set access token in localStorage
 */
export function setAccessToken(token: string): void {
  try {
    localStorage.setItem('access_token', token);
  } catch (error) {
    console.error('Error setting access token:', error);
  }
}

/**
 * Remove access token from localStorage
 */
export function removeAccessToken(): void {
  try {
    localStorage.removeItem('access_token');
  } catch (error) {
    console.error('Error removing access token:', error);
  }
}

/**
 * Check if a JWT token is valid (not expired)
 * @param token - JWT token to validate
 * @returns boolean indicating if token is valid
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) {
    console.log('isTokenValid: No token provided');
    return false;
  }

  try {
    // Check if token has the correct format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('isTokenValid: Invalid token format');
      return false;
    }

    // Parse JWT token (simple base64 decode of payload)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token has expired
    const isValid = payload.exp && payload.exp > currentTime;
    
    console.log('isTokenValid:', {
      tokenExists: !!token,
      hasExp: !!payload.exp,
      exp: payload.exp,
      currentTime,
      isValid,
      timeRemaining: payload.exp ? payload.exp - currentTime : null
    });

    return isValid;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

/**
 * Check if user is authenticated (has valid access token)
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  const isValid = isTokenValid(token);
  
  console.log('isAuthenticated check:', {
    hasToken: !!token,
    isValid,
    tokenLength: token?.length,
    timestamp: new Date().toISOString()
  });
  
  return isValid;
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthData(): void {
  try {
    removeAccessToken();
    clearUserRole();
    // Remove any other auth-related data
    localStorage.removeItem('user');
    localStorage.removeItem('auth_state');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}

/**
 * Get user data from localStorage
 */
export function getUser(): any | null {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Set user data in localStorage
 */
export function setUser(user: any): void {
  try {
    console.log('Saving user data to localStorage:', user);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user data:', error);
  }
}

/**
 * Decode JWT token and extract payload
 */
export function decodeJWT(token: string): any {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  
  const payload = decodeJWT(token);
  return payload?.sub || null;
}

/**
 * Get employee ID from JWT token
 */
export function getEmployeeIdFromToken(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  
  const payload = decodeJWT(token);
  return payload?.employee_id || null;
}

/**
 * Store user role in localStorage
 */
export function setUserRole(role: string): void {
  try {
    localStorage.setItem('user_role', role);
  } catch (error) {
    console.error('Error setting user role:', error);
  }
}

/**
 * Get user role from localStorage
 */
export function getUserRole(): string | null {
  try {
    return localStorage.getItem('user_role');
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Clear user role from localStorage
 */
export function clearUserRole(): void {
  try {
    localStorage.removeItem('user_role');
  } catch (error) {
    console.error('Error clearing user role:', error);
  }
}

// Time Utility Functions

/**
 * Get current time in HH:MM format
 * @returns string in HH:MM format (e.g., "14:30")
 */
export function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get current time in HH:MM:SS format
 * @returns string in HH:MM:SS format (e.g., "14:30:45")
 */
export function getCurrentTimeWithSeconds(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
