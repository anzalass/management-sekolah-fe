import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import KonselingListingPage from '@/features/e-konseling/konseling-listing';
import KonselingTableAction from '@/features/e-konseling/konseling-tables/konseling-table-action';
import BukuListingPage from '@/features/e-perpus/buku-listing';
import BukuTableAction from '@/features/e-perpus/buku-tables/buku-table-action';
import { RenderTriggerProvider } from '@/hooks/use-rendertrigger';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Anggaran Sekolah'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <RenderTriggerProvider>
      <PageContainer scrollable={false}>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading title='Data Konseling' description='' />
            <Link
              href='/dashboard/e-konseling/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Tambah Konseling
            </Link>
          </div>
          <Separator />
          <KonselingTableAction />
          <Suspense
            key={key}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <KonselingListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </RenderTriggerProvider>
  );
}
