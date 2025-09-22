'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  CATEGORY_OPTIONS,
  useSiswaTableFilters
} from './use-siswa-table-filters';

export default function SiswaTableAction() {
  const {
    kelas,
    setKelasFilter,
    isAnyFilterActive,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter,
    nipFilter,
    setNipFilter
  } = useSiswaTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Nama'
        searchQuery={namaFilter}
        setSearchQuery={setNamaFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='NIS'
        searchQuery={nipFilter}
        setSearchQuery={setNipFilter}
        setPage={setPage}
      />
      {/* <DataTableFilterBox
        filterKey='kelas'
        title='Kelas'
        options={CATEGORY_OPTIONS}
        setFilterValue={setKelasFilter}
        filterValue={kelas}
      /> */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
