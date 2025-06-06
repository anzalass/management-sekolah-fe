'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useGuruTemplateTableFilters } from './use-guru-template-table-filters';

export default function GuruTemplateTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    searchQuery,
    setSearchQuery
  } = useGuruTemplateTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Name'
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
