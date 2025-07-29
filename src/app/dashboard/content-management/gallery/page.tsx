import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import GalleryListingPage from '@/features/kontent-management/gallery/galery-listing';
import GalleryTableAction from '@/features/kontent-management/gallery/galery-tables/galery-table-action';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Gallery'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Gallery' description='' />
          <Link
            href='/dashboard/content-management/gallery/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Tambah Gambar
          </Link>
        </div>
        <Separator />
        <GalleryTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
        >
          <GalleryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
