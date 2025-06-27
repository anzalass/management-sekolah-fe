import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import GalleryViewPage from '@/features/kontent-management/gallery/galery-view';

export const metadata = {
  title: 'Dashboard : Gallery'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <GalleryViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
