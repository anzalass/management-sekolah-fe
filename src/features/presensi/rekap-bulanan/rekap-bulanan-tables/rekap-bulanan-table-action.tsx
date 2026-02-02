'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useRekapBulananTableFilters } from './use-rekap-bulanan-table-filters';
import { Input } from '@/components/ui/input';

import { useTransition } from 'react';

export default function RekapBulananTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    nipFilter,
    setNipFilter,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = useRekapBulananTableFilters();

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      <DataTableSearch
        searchKey='Nama'
        searchQuery={namaFilter}
        setSearchQuery={setNamaFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='NIP'
        searchQuery={nipFilter}
        setSearchQuery={setNipFilter}
        setPage={setPage}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
