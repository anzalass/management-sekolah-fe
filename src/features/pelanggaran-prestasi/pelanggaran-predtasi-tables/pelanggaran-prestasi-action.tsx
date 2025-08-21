'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { usePelanggaranPrestasiTableFilters } from './use-pelanggaran-prestasi-table-filters'; // Custom hook to handle filters for Pendaftaran
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';

export default function PelanggaranPrestasiTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    nisFilter,
    setNisFilter,
    waktuFilter,
    setWaktuFilter,
    resetFilters,
    setPage,
    searchQuery,
    jenisFilter,
    setJenisFilter,
    setSearchQuery
  } = usePelanggaranPrestasiTableFilters(); // Use the custom hook for Pendaftaran filters

  const handleChangeTanggal = (value: string) => {
    setWaktuFilter(value, { startTransition });
    setPage(1);
  };

  const handleChangeJenis = (value: string) => {
    setJenisFilter(value, { startTransition });
    setPage(1);
  };
  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      {/* Search functionality for Pendaftaran */}
      <DataTableSearch
        searchKey='Nama' // Searching by student name (can be adjusted)
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      <Select value={jenisFilter} onValueChange={handleChangeJenis}>
        <SelectTrigger>
          <SelectValue placeholder='Pilih Jenis Pelanggaran' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='Pelanggaran'>Pelanggaran</SelectItem>
          <SelectItem value='Prestasi'>Prestasi</SelectItem>
        </SelectContent>
      </Select>

      <DataTableSearch
        searchKey='Nis' // Searching by student name (can be adjusted)
        searchQuery={nisFilter}
        setSearchQuery={setNisFilter}
        setPage={setPage}
      />
      <Input
        type='date'
        placeholder='Masukan Tanggal'
        value={waktuFilter}
        onChange={(e) => handleChangeTanggal(e.target.value)}
      />

      {/* Reset filters */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
