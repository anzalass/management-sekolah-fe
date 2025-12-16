import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DaftarInventarisViewPage from '@/features/inventaris/inventaris-masuk/daftar-inventaris-view';

export const metadata = {
  title: 'Dashboard : Inventaris Masuk'
};

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DaftarInventarisViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
