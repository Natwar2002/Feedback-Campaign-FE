import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './route-constants';

export type UserRole = 'admin' | 'member' | 'guest';

/**
 * Interface for authenticated user with role and permissions
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  permissions?: string[];
}

/**
 * Props for route protection components
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  requiredRoles?: UserRole[];
  userRole?: UserRole;
  fallbackTo?: string;
}

/**
 * ProtectedRoute component for authentication guard
 * Redirects unauthenticated users to login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  requiredRoles,
  userRole,
  fallbackTo = ROUTES.AUTH.LOGIN,
}) => {
  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to={fallbackTo} replace />;
  }

  // Check role-based access control (RBAC)
  if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
};

/**
 * Hook to check if user has required permission
 */
export const useHasPermission = (requiredPermission: string, userPermissions?: string[]): boolean => {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission);
};

/**
 * Hook to check if user has required role
 */
export const useHasRole = (requiredRoles: UserRole[], userRole?: UserRole): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};
