import SiswaHomeView from '@/features/siswa-dashboard/siswa-dashboard-view';
import { auth } from '@/lib/auth';
import React from 'react';

export default async function page() {
  const authan = await auth();

  return <SiswaHomeView />;
}
