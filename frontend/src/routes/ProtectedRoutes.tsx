import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from '../components/layout/sidebar/LoadingState';
//import { useAuth } from '../contexts/MockAuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

/**
 * ProtectedRoute component that checks for valid authentication and role-based access
 * before allowing access to protected pages.
 * 
 * Features:
 * - Checks for valid authentication
 * - Validates user role against allowed roles
 * - Redirects unauthenticated users to login
 * - Redirects unauthorized users to unauthorized page
 * - Uses Outlet pattern for nested routing
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Log auth state changes for debugging
  useEffect(() => {
    console.log('ProtectedRoute useEffect - Auth state changed:', {
      pathname: location.pathname,
      isAuthenticated,
      isLoading,
      user,
      allowedRoles
    });
  }, [location.pathname, isAuthenticated, isLoading, user, allowedRoles]);

  console.log('ProtectedRoute check:', {
    pathname: location.pathname,
    user,
    isAuthenticated,
    isLoading,
    allowedRoles,
    userRole: user?.role
  });

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: Showing loading state');
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50" tabIndex={-1}>
        <LoadingState message="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login', {
      pathname: location.pathname,
      isAuthenticated,
      user
    });
    
    // Clear any lingering focus before redirect
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    return <Navigate to="/auth/login" replace />;
  }

  // If no user data or user role not in allowed roles, redirect to unauthorized
  if (!user || !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute: User not authorized for this route', {
      userRole: user?.role,
      allowedRoles,
      currentPath: location.pathname
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized, render the child routes
  console.log('ProtectedRoute: User authenticated and authorized, rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute; 