'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useTestimonialTableFilters } from './use-testimoni-table-filters';

export default function TestimonialTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    searchQuery,
    setSearchQuery
  } = useTestimonialTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Description'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
