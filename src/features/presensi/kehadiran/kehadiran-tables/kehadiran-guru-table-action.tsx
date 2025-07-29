'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useKehadiranGuruTableFilters } from './use-kehadiran-guru-table-filters';
import { Input } from '@/components/ui/input';

import { useTransition } from 'react';

export default function KehadiranGuruTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    tanggalFilter,
    setTanggalFilter,
    nipFilter,
    setNipFilter,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = useKehadiranGuruTableFilters();

  const handleChangeTanggal = (value: string) => {
    setTanggalFilter(value, { startTransition });
    setPage(1);
  };

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

      <Input
        type='date'
        placeholder='Masukan Tanggal'
        value={tanggalFilter}
        onChange={(e) => handleChangeTanggal(e.target.value)}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
