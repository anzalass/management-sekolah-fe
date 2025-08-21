import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import GuruStaffTableAction from '@/features/master-data/guru-staff/guru-staff-tables/gurustaff-table-action';
import GuruStaffListingPage from '@/features/master-data/guru-staff/guru-staff-listing';
import SiswaListingPage from '@/features/master-data/siswa/siswa-listing';
import SiswaTableAction from '@/features/master-data/siswa/siswa-tables/siswa-table-action';
import { RenderTriggerProvider } from '@/hooks/use-rendertrigger';
import PendaftaranListingPage from '@/features/pendaftaran/pendaftaran-listing';
import PendaftaranTableActions from '@/features/pendaftaran/pendaftaran-tables/pendaftaran-table-action';

export const metadata = {
  title: 'Dashboard: Siswa'
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
            <h1 className='text-base md:text-lg'>Pendaftaran Siswa</h1>
            <Link
              href='/dashboard/pendaftaran/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Tambah Pendaftaran
            </Link>
          </div>
          <Separator />
          <PendaftaranTableActions />
          <Suspense
            key={key}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <PendaftaranListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </RenderTriggerProvider>
  );
}
