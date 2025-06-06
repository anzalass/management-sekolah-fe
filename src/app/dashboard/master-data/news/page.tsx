import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import NewsListingPage from '@/features/news/news-listing';
import NewsTableAction from '@/features/news/news-tables/news-table-action';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: News'
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
          <Heading title='News' description='' />
          <Link
            href='/dashboard/master-data/news/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Tambah Berita
          </Link>
        </div>
        <Separator />
        <NewsTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <NewsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
