'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { usePendaftaranTableFilters } from './use-pendaftaran-table-filters'; // Custom hook to handle filters for Pendaftaran

export default function PendaftaranTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    searchQuery,
    setSearchQuery
  } = usePendaftaranTableFilters(); // Use the custom hook for Pendaftaran filters

  return (
    <div className='flex flex-wrap items-center gap-4'>
      {/* Search functionality for Pendaftaran */}
      <DataTableSearch
        searchKey='Pendaftar' // Searching by student name (can be adjusted)
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
