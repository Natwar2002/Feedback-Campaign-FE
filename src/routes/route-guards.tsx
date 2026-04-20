import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ROUTES } from './route-constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute — redirects to login if not signed in via Clerk
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <>{children}</>;
};

/**
 * PublicRoute — redirects to dashboard if already signed in
 * Use this to wrap login/register so signed-in users can't revisit them
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (isSignedIn) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
};