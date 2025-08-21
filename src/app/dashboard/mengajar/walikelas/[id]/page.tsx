import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import WaliKelasDashboard from '@/features/mengajar/walikelas/walikelas-view';

export const metadata = {
  title: 'Dashboard : Guru & Staff'
};

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <div className='space-y-4 overflow-y-auto'>
      <Suspense fallback={<FormCardSkeleton />}>
        <WaliKelasDashboard id={params.id} />
      </Suspense>
    </div>
  );
}
