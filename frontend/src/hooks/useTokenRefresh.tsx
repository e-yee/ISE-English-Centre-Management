import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAccessToken, isTokenValid } from '../lib/utils';

interface UseTokenRefreshOptions {
  refreshInterval?: number; // in milliseconds
  enableAutoRefresh?: boolean;
}

/**
 * Hook for handling automatic token refresh
 * 
 * @param options - Configuration options for token refresh
 * @param options.refreshInterval - How often to check for token refresh (default: 5 minutes)
 * @param options.enableAutoRefresh - Whether to enable automatic refresh (default: true)
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const { refreshInterval = 5 * 60 * 1000, enableAutoRefresh = true } = options;
  const { refreshToken, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enableAutoRefresh || !isAuthenticated) {
      return;
    }

    const checkAndRefreshToken = async () => {
      try {
        const token = getAccessToken();
        
        // If no token, don't attempt refresh
        if (!token) {
          console.log('TokenRefresh: No token available, skipping refresh');
          return;
        }

        // Check if token is about to expire (within 5 minutes)
        if (!isTokenValid(token)) {
          console.log('TokenRefresh: Token expired or invalid, attempting refresh');
          await refreshToken();
        } else {
          console.log('TokenRefresh: Token still valid, no refresh needed');
        }
      } catch (error) {
        console.error('TokenRefresh: Error during token refresh:', error);
      }
    };

    // Initial check
    checkAndRefreshToken();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkAndRefreshToken, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshToken, isAuthenticated, enableAutoRefresh, refreshInterval]);

  // Manual refresh function
  const manualRefresh = async () => {
    try {
      await refreshToken();
      return true;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  return {
    manualRefresh,
  };
};

export default useTokenRefresh; 