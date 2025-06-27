import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import TestimonialViewPage from '@/features/kontent-management/testimoni/testimoni-view';

export const metadata = {
  title: 'Dashboard : Testimonial' // Update to Testimonial
};

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <TestimonialViewPage id={params.id} /> {/* Use TestimonialViewPage */}
        </Suspense>
      </div>
    </PageContainer>
  );
}
