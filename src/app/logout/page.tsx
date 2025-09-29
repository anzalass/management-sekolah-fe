// pages/logout.tsx
'use client';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Loading from '@/features/siswa-dashboard/loading';

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/login-siswa' });
  }, []);
  return <Loading />;
}
