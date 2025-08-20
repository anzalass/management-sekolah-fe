'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useBukuTableFilters } from './use-buku-table-filters'; // Custom hook to handle filters for Pendaftaran
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';

export default function BukuTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    searchQuery,
    setSearchQuery
  } = useBukuTableFilters(); // Use the custom hook for Pendaftaran filters

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      {/* Search functionality for Pendaftaran */}
      <DataTableSearch
        searchKey='Nama' // Searching by student name (can be adjusted)
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      {/* Reset filters */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
