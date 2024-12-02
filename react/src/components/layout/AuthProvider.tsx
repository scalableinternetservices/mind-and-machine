'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/auth';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // initialize auth when the app starts
    authService.initializeAuth();
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
} 