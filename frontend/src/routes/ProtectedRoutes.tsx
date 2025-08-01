import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
//import { useAuth } from '../contexts/AuthContext';
import { useAuth } from '../contexts/MockAuthContext';

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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }

  // If no user data or user role not in allowed roles, redirect to unauthorized
  if (!user || !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute: User not authorized for this route', {
      userRole: user?.role,
      allowedRoles,
      currentPath: window.location.pathname
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized, render the child routes
  console.log('ProtectedRoute: User authenticated and authorized, rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute; 