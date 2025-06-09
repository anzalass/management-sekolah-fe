'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  CATEGORY_OPTIONS,
  usePendaftaranTableFilters
} from './use-pendaftaran-table-filters';

export default function PendaftaranTableActions() {
  const {
    studentName,
    setStudentName,
    isAnyFilterActive,
    resetFilters,
    setPage,
    parentName,
    setParentName,
    yourLocation,
    setYourLocation
  } = usePendaftaranTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Nama'
        searchQuery={studentName}
        setSearchQuery={setStudentName}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='Nama Orang Tua'
        searchQuery={parentName}
        setSearchQuery={setParentName}
        setPage={setPage}
      />

      <DataTableSearch
        searchKey='Alamat'
        searchQuery={yourLocation}
        setSearchQuery={setYourLocation}
        setPage={setPage}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
