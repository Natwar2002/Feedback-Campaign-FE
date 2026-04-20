import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes/route-constants';
import { Home } from '@/page/Home';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ProtectedRoute, PublicRoute } from '@/routes/route-guards';

// Lazy load layouts
// const DashboardLayout = React.lazy(() =>
//   import('@/layouts/dashboard.layout').then((m) => ({ default: m.DashboardLayout }))
// );

const Organization = React.lazy(() =>
  import('@/page/Organization').then((m) => ({ default: m.Organization }))
);

const PageLoader = () => <div>Loading...</div>;

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ─────────────────────────────────────────
            PUBLIC ROUTES
            Accessible to everyone.
            Signed-in users are redirected away from auth pages.
        ───────────────────────────────────────── */}

        <Route path={ROUTES.ROOT} element={<Home />} />

        <Route
          path={ROUTES.AUTH.LOGIN}
          element={
            <PublicRoute>
              <SignIn
                routing="path"
                path={ROUTES.AUTH.LOGIN}
              />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.AUTH.REGISTER}
          element={
            <PublicRoute>
              <SignUp
                routing="path"
                path={ROUTES.AUTH.REGISTER}
              />
            </PublicRoute>
          }
        />

        {/* ─────────────────────────────────────────
            PRIVATE ROUTES
            Require an active Clerk session.
            Unauthenticated users are sent to /auth/login.
        ───────────────────────────────────────── */}

        <Route
          path={ROUTES.PROTECTED.ORGANIZATION}
          element={
            <ProtectedRoute>
              <Organization />
            </ProtectedRoute>
          }
        />

        {/* ─────────────────────────────────────────
            FALLBACKS
        ───────────────────────────────────────── */}

        {/* Redirect bare /auth to login */}
        <Route
          path="/auth"
          element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
        />

        {/* 404 */}
        <Route path="*" element={<div>404 — Page Not Found</div>} />

      </Routes>
    </Suspense>
  );
};
