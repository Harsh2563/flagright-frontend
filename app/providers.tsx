'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '../contexts/UserContext';
import { TransactionProvider } from '../contexts/TransactionContext';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {' '}
        <UserProvider>
          <TransactionProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#121212',
                  color: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  fontSize: '14px',
                },
              }}
            />
            {children}
          </TransactionProvider>
        </UserProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
