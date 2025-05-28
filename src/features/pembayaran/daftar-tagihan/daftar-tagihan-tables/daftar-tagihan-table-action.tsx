'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { usePengumumanTableFilters } from './use-daftar-tagihan-table-filters';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTransition } from 'react';

export default function PengumumanTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    tanggalFilter,
    setTanggalFilter,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = usePengumumanTableFilters();

  const handleChangeTanggal = (value: string) => {
    setTanggalFilter(value, { startTransition });
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
      <Input
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
