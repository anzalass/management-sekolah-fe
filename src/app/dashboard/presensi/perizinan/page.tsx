import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import PerizinanGuruListingPage from '@/features/presensi/perizinan/perizinan-guru-listing';
import PerizinanGuruTableAction from '@/features/presensi/perizinan/perizinan-tables/perizinan-guru-table-action';
import { RenderTriggerProvider } from '@/hooks/use-rendertrigger';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Daftar Inventaris'
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
            <Heading title='Perizinan Guru' description='' />
          </div>
          <Separator />
          <PerizinanGuruTableAction />
          <Suspense
            key={key}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <PerizinanGuruListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </RenderTriggerProvider>
  );
}
