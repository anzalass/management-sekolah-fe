import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import SiswaViewPage from '@/features/master-data/siswa/siswa-view';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Guru & Staff'
};

type PageProps = { params: Promise<{ nis: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <SiswaViewPage nis={params.nis} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
