import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import BukuViewPageMengajar from '@/features/e-perpus/buku-view-mengajar';

export const metadata = {
  title: 'Dashboard : Perpustakaan'
};

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <BukuViewPageMengajar id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
