// src/app/dashboard/mengajar/kelas-mapel/[idkelas]/page.tsx

import dynamic from 'next/dynamic';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { Suspense } from 'react';

const KelasMapelView = dynamic(
  () => import('@/features/mengajar/kelas-mapel/kelas-mapel-view'),
  {
    loading: () => <FormCardSkeleton />
  }
);

type PageProps = { params: { idkelas: string } };

export default async function Page({ params }: PageProps) {
  return (
    <div className='space-y-4 overflow-y-auto'>
      <Suspense fallback={<FormCardSkeleton />}>
        <KelasMapelView id={params.idkelas} />
      </Suspense>
    </div>
  );
}
