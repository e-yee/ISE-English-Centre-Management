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
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem('refresh_token');
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Set refresh token in localStorage
 */
export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem('refresh_token', token);
  } catch (error) {
    console.error('Error setting refresh token:', error);
  }
}

/**
 * Remove refresh token from localStorage
 */
export function removeRefreshToken(): void {
  try {
    localStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
}

/**
 * Check if a JWT token is valid (not expired)
 * @param token - JWT token to validate
 * @returns boolean indicating if token is valid
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    // Parse JWT token (simple base64 decode of payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token has expired
    return payload.exp && payload.exp > currentTime;
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
  return isTokenValid(token);
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthData(): void {
  try {
    removeAccessToken();
    removeRefreshToken();
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
