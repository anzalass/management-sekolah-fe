'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useHariLiburTableFilters } from './use-hari-libur-table-filters';
import { Input } from '@/components/ui/input';
import { useTransition } from 'react';

export default function HariLiburTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    namaHariFilter,
    setNamaHariFilter,
    tanggalFilter,
    setTanggalFilter
  } = useHariLiburTableFilters();

  const handleChangeTanggal = (value: string) => {
    setTanggalFilter(value, { startTransition });
    setPage(1);
  };

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Nama Hari'
        searchQuery={namaHariFilter}
        setSearchQuery={setNamaHariFilter}
        setPage={setPage}
      />

      <Input
        className='w-fit'
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
