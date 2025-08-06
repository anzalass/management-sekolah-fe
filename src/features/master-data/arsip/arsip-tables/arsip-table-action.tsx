'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useRuangTableFilters } from './use-arsip-table-filters';
import { Input } from '@/components/ui/input';
import { useTransition } from 'react';

export default function ArsipTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    namaBerkasFilter,
    setNamaBerkasFilter,
    keteranganFilter,
    setKeteranganFilter,
    tanggalFilter,
    setTanggalFilter
  } = useRuangTableFilters();

  const handleChangeTanggal = (value: string) => {
    setTanggalFilter(value, { startTransition });
    setPage(1);
  };

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='NamaBerkas'
        searchQuery={namaBerkasFilter}
        setSearchQuery={setNamaBerkasFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='Keterangan'
        searchQuery={keteranganFilter}
        setSearchQuery={setKeteranganFilter}
        setPage={setPage}
      />
      <Input
        className='w-fit'
        type='date'
        placeholder='Masukan Tanggal'
        value={tanggalFilter}
        onChange={(e) => handleChangeTanggal(e.target.value)}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
