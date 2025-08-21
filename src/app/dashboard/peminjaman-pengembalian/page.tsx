import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import KonselingTableAction from '@/features/e-konseling/konseling-tables/konseling-table-action';
import BukuListingPage from '@/features/e-perpus/buku-listing';
import BukuTableAction from '@/features/e-perpus/buku-tables/buku-table-action';
import PeminjamanPengembalianListingPage from '@/features/pengembalian-peminjaman/peminjaman-pengembalian-listing';
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
            <Heading title='Data Buku' description='' />
            <Link
              href='/dashboard/peminjaman-pengembalian/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Tambah Peminjaman
            </Link>
          </div>
          <Separator />
          <BukuTableAction />
          <Suspense
            key={key}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <PeminjamanPengembalianListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </RenderTriggerProvider>
  );
}
