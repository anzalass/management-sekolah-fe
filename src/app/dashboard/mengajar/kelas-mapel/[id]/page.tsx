import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import KelasMapelView from '@/features/kelas-mapel/kelas-mapel-view';

export const metadata = {
  title: 'Dashboard : Guru & Staff'
};

type PageProps = { params: { id: string } }; // ✅ fixed

export default async function Page({ params }: PageProps) {
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
