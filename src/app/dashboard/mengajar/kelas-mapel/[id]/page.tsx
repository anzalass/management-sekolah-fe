import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import RuanganViewPage from '@/features/master-data/ruang/ruang-view';
import MapelViewPage from '@/features/master-data/mapel/mapel-view';
import WaliKelasDashboard from '@/features/walikelas/walikelas-view';
import KelasMapelView from '@/features/kelas-mapel/kelas-mapel-view';

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
          <KelasMapelView id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
