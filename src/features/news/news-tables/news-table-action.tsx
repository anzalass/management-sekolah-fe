'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  useNewsTableFilters,
  CATEGORY_OPTIONS
} from './use-news-table-filters';

export default function NewsTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    searchQuery,
    setSearchQuery
  } = useNewsTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Title'
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
