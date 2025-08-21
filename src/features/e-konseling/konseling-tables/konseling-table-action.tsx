'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useKonselingTableFilters } from './use-konseling-table-filters'; // Custom hook to handle filters for Pendaftaran
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';

export default function KonselingTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    nisFilter,
    setNisFilter,
    tanggalFilter,
    setTanggalFilter,
    resetFilters,
    setPage,
    searchQuery,
    setSearchQuery
  } = useKonselingTableFilters(); // Use the custom hook for Pendaftaran filters

  const handleChangeTanggal = (value: string) => {
    setTanggalFilter(value, { startTransition });
    setPage(1);
  };

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      {/* Search functionality for Pendaftaran */}
      <DataTableSearch
        searchKey='Nama' // Searching by student name (can be adjusted)
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      <DataTableSearch
        searchKey='Nis' // Searching by student name (can be adjusted)
        searchQuery={nisFilter}
        setSearchQuery={setNisFilter}
        setPage={setPage}
      />
      <Input
        type='date'
        placeholder='Masukan Tanggal'
        value={tanggalFilter}
        onChange={(e) => handleChangeTanggal(e.target.value)}
      />

      {/* Reset filters */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
