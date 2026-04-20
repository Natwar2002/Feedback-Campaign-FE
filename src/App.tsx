import React, { useEffect } from 'react';
import { AppProvider } from '@/providers/app-provider';
import { AppRoutes } from '@/routes/app-routes';
import { useAuth } from '@clerk/clerk-react';
import { setClerkTokenGetter } from '@/services/api-client';

const AppInner: React.FC = () => {
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  if (!isLoaded) return <div>Loading...</div>;

  return <AppRoutes />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
};