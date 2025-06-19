'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useMengajarTableFilters } from './use-mengajar-table-filters';

import { useTransition } from 'react';

export default function MengajarTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    namaMapelFilter,
    ruangKelasFilter,
    tahunAjaranFilter,
    waktuMengajarFilter,
    setNamaMapelFilter,
    setRuangKelasFilter,
    settahunAjaranFilter,
    setwaktuMengajarFilter,

    resetFilters,
    setPage
  } = useMengajarTableFilters();

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      <DataTableSearch
        searchKey='Nama Mapel'
        searchQuery={namaMapelFilter}
        setSearchQuery={setNamaMapelFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='Ruang Kelas'
        searchQuery={ruangKelasFilter}
        setSearchQuery={setRuangKelasFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='Tahun Ajaran'
        searchQuery={tahunAjaranFilter}
        setSearchQuery={settahunAjaranFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='Waktu Mengajar'
        searchQuery={waktuMengajarFilter}
        setSearchQuery={setwaktuMengajarFilter}
        setPage={setPage}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
