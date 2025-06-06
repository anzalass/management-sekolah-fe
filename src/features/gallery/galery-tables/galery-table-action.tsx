'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useGalleryTableFilters } from './use-galery-table-filters';
export default function GalleryTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    imageFilter,
    setImageFilter
  } = useGalleryTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Image'
        searchQuery={imageFilter}
        setSearchQuery={setImageFilter}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
