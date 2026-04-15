import React, { useEffect, useState } from 'react';
import { AppProvider } from '@/providers/app-provider';
import { AppRoutes } from '@/routes/app-routes';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AppProvider>
          <AppRoutes isAuthenticated={isAuthenticated} userRole={userRole} />
    </AppProvider>
  );
};
