import React from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { RouterProvider } from '@/providers/router-provider';
import { ClerkAuthProvider } from '@/providers/clerk-provider';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ClerkAuthProvider>
      <QueryProvider>
        <RouterProvider>
          {children}
        </RouterProvider>
      </QueryProvider>
    </ClerkAuthProvider>
  );
};
