import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Hook for handling authentication guards in components
 * 
 * @param options - Configuration options for the auth guard
 * @param options.redirectTo - Where to redirect if auth check fails (default: '/auth/login')
 * @param options.requireAuth - Whether authentication is required (default: true)
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectTo = '/auth/login', requireAuth = true } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If auth is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      console.log('AuthGuard: User not authenticated, redirecting to login');
      
      // Store the intended destination for post-login redirect
      const from = location.pathname + location.search;
      
      navigate(redirectTo, { 
        state: { from },
        replace: true 
      });
      return;
    }

    // If auth is not required but user is authenticated (e.g., redirect from login page)
    if (!requireAuth && isAuthenticated) {
      console.log('AuthGuard: User already authenticated, redirecting to home');
      navigate('/home', { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, navigate, location]);

  return {
    isAuthenticated,
    isLoading,
    isChecking: isLoading,
  };
};

export default useAuthGuard; 