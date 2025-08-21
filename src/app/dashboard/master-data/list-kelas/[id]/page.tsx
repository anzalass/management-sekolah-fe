import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import AnggaranViewPage from '@/features/master-data/anggaran/anggaran-view';
import ListKelasViewPage from '@/features/master-data/list-kelas/list-kelas-view';

export const metadata = {
  title: 'Dashboard : Anggaran'
};

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ListKelasViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
