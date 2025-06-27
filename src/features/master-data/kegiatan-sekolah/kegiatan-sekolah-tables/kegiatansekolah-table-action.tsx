'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  CATEGORY_OPTIONS,
  useKegiatanSekolahTableFilters
} from './use-kegiatansekolah-table-filters';

export default function KegiatanSekolahTableAction() {
  const {
    isAnyFilterActive,
    tahunAjaran,
    setTahunAjaranFilter,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = useKegiatanSekolahTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Nama'
        searchQuery={namaFilter}
        setSearchQuery={setNamaFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='Tahun Ajaran'
        searchQuery={tahunAjaran}
        setSearchQuery={setTahunAjaranFilter}
        setPage={setPage}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
