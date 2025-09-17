import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DetailKelasView from '@/features/siswa-dashboard/kelas/detail-kelas-view';

export const metadata = {
  title: 'Dashboard : Detail Kelas'
};

type PageProps = { params: { id: string } };

export default async function Page({ params }: PageProps) {
  return (
    <div className=''>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DetailKelasView id={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
