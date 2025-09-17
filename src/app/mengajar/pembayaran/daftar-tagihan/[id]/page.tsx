import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DaftarInventarisViewPage from '@/features/inventaris/daftar-inventaris/daftar-inventaris-view';
import DaftarTagihannViewPage from '@/features/pembayaran/daftar-tagihan/daftar-tagihan-view';

export const metadata = {
  title: 'Dashboard : Jenis Inventaris'
};

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DaftarTagihannViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
