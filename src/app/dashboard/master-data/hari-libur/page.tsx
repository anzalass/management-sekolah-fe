import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import AnggaranListingPage from '@/features/master-data/anggaran/anggaran-listing';
import AnggaranTableAction from '@/features/master-data/anggaran/anggaran-tables/anggaran-table-action';
import HariLiburListingPage from '@/features/master-data/hari-libur/hari-libur-listing';
import HariLiburTableAction from '@/features/master-data/hari-libur/hari-libur-tables/hari-libur-action';
import KegiatanSekolahListingPage from '@/features/master-data/kegiatan-sekolah/kegiatan-sekolah-listing';
import KegiatanSekolahTableAction from '@/features/master-data/kegiatan-sekolah/kegiatan-sekolah-tables/kegiatansekolah-table-action';
import RuangListingPage from '@/features/master-data/ruang/ruang-listing';
import RuangTableAction from '@/features/master-data/ruang/ruang-tables/ruang-table-action';
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
            <h1 className='text-lg md:text-2xl'>Hari Libur</h1>
            <Link
              href='/dashboard/master-data/hari-libur/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Hari Libur
            </Link>
          </div>
          <Separator />
          <HariLiburTableAction />
          <Suspense
            key={key}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <HariLiburListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </RenderTriggerProvider>
  );
}
