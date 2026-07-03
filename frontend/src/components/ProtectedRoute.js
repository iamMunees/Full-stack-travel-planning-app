'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated()) {
    return null;
  }

  return children;
}
