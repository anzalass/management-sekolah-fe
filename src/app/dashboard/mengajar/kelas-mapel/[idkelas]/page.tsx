// src/app/dashboard/mengajar/kelas-mapel/[idkelas]/page.tsx

import dynamic from 'next/dynamic';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';

const KelasMapelView = dynamic(
  () => import('@/features/mengajar/kelas-mapel/kelas-mapel-view'),
  {
    loading: () => <FormCardSkeleton />
  }
);

type PageProps = { params: { idkelas: string } };

export default async function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <KelasMapelView id={params.idkelas} />
      </div>
    </PageContainer>
  );
}
