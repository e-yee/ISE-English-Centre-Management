import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getAccessToken } from '../../lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that checks for valid authentication
 * before allowing access to protected pages.
 * 
 * Features:
 * - Checks for valid access token
 * - Redirects unauthenticated users to login
 * - Shows loading state during authentication check
 * - Preserves the intended destination for post-login redirect
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const token = getAccessToken();
        const isAuth = isAuthenticated();
        
        console.log('ProtectedRoute: Checking authentication', {
          hasToken: !!token,
          isAuthenticated: isAuth,
          currentPath: location.pathname
        });

        setAuthenticated(isAuth);
      } catch (error) {
        console.error('ProtectedRoute: Error checking authentication:', error);
        setAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [location.pathname]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!authenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    
    // Store the intended destination for post-login redirect
    const from = location.pathname + location.search;
    
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from }} 
        replace 
      />
    );
  }

  // User is authenticated, render the protected content
  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
