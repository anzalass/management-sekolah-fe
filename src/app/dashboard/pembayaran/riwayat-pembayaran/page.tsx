import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

import { RenderTriggerProvider } from '@/hooks/use-rendertrigger';
import { searchParamsCache, serialize } from '@/lib/searchparams';

import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import RiwayatPembayaranListingPage from '@/features/pembayaran/riwayat-pembayaran/riwayat-pembayaran-listing';
import RiwayatPembayaranTableAction from '@/features/pembayaran/riwayat-pembayaran/riwayat-pembayaran-tables/riwayat-pembayaran-table-action';

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
            <h1 className='text-lg md:text-2xl'>Riwayat Pembayaran</h1>{' '}
            {/* <Link
              href='/dashboard/inventaris/daftar-inventaris/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Tambah Daftar Inventaris
            </Link> */}
          </div>
          <Separator />
          <RiwayatPembayaranTableAction />
          <Suspense
            key={key}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <RiwayatPembayaranListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </RenderTriggerProvider>
  );
}
