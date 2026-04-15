import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes/route-constants';
import { ProtectedRoute } from '@/routes/route-guards';
import { Home } from '@/page/Home';

// Lazy load layouts
// const DashboardLayout = React.lazy(() =>
//   import('@/layouts/dashboard.layout').then((m) => ({ default: m.DashboardLayout }))
// );


interface AppRoutesProps {
  isAuthenticated: boolean;
  userRole?: string;
}

/**
 * Main routes configuration for the application
 * Handles both public and protected routes
 */
export const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated, userRole }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Home/>} />
        {/* 404 Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
};
