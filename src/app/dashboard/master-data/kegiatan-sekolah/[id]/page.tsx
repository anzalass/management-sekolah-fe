import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import GuruStaffViewPage from '@/features/master-data/guru-staff/guru-staff-view';
import KegiatanSekolahViewPage from '@/features/master-data/kegiatan-sekolah/kegiatan-sekolah-view';

export const metadata = {
  title: 'Dashboard : Guru & Staff'
};

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <KegiatanSekolahViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
