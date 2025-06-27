import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import KegiatanSekolahListingPage from '@/features/master-data/kegiatan-sekolah/kegiatan-sekolah-listing';
import KegiatanSekolahTableAction from '@/features/master-data/kegiatan-sekolah/kegiatan-sekolah-tables/kegiatansekolah-table-action';
import MapelListingPage from '@/features/master-data/mapel/mapel-listing';
import MapelTableAction from '@/features/master-data/mapel/mapel-tables/mapel-table-action';
import RuangListingPage from '@/features/master-data/ruang/ruang-listing';
import RuangTableAction from '@/features/master-data/ruang/ruang-tables/ruang-table-action';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Kegiatan Sekolah'
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
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Mata Pelajaran' description='' />
          <Link
            href='/dashboard/master-data/mata-pelajaran/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Tambah Mata Pelajaran
          </Link>
        </div>
        <Separator />
        <MapelTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <MapelListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
