'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { usePerizinanGuruTableFilters } from './use-perizinan-guru-table-filters';
import { Input } from '@/components/ui/input';

import { useTransition } from 'react';

export default function PerizinanGuruTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    startDate,
    setStartDate,
    endDate,
    setEndDate,

    nipFilter,
    setNipFilter,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = usePerizinanGuruTableFilters();

  const handleChangeTanggalStart = (value: string) => {
    setStartDate(value, { startTransition });
    setPage(1);
  };

  const handleChangeTanggalEnd = (value: string) => {
    setEndDate(value, { startTransition });
    setPage(1);
  };

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      <DataTableSearch
        searchKey='Nama'
        searchQuery={namaFilter}
        setSearchQuery={setNamaFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='NIP'
        searchQuery={nipFilter}
        setSearchQuery={setNipFilter}
        setPage={setPage}
      />

      <Input
        type='date'
        placeholder='Tanggal Mulai'
        value={startDate}
        onChange={(e) => handleChangeTanggalStart(e.target.value)}
      />

      <Input
        type='date'
        placeholder='Tanggal Selesai'
        value={endDate}
        onChange={(e) => handleChangeTanggalEnd(e.target.value)}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
