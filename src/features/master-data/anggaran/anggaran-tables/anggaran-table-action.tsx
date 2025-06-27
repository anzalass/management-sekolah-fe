'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useAnggaranTableFilters } from './use-anggaran-table-filters';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTransition } from 'react';

export default function AnggaranTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    tanggalFilter,
    setTanggalFilter,
    jenisFilter,
    setJenisFilter,
    jumlahFilter,
    setJumlahFilter,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = useAnggaranTableFilters();

  const handleChangeTanggal = (value: string) => {
    setTanggalFilter(value, { startTransition });
    setPage(1);
  };

  const handleChangeJenis = (value: string) => {
    setJenisFilter(value, { startTransition });
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
        searchKey='Jumlah'
        searchQuery={jumlahFilter}
        setSearchQuery={setJumlahFilter}
        setPage={setPage}
      />
      <Select value={jenisFilter} onValueChange={handleChangeJenis}>
        <SelectTrigger>
          <SelectValue placeholder='Pilih Jenis Anggaran' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='pemasukan'>Pemasukan</SelectItem>
          <SelectItem value='pengeluaran'>Pengeluaran</SelectItem>
        </SelectContent>
      </Select>
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
