'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useTagihanTableFilters } from './use-daftar-tagihan-table-filters';
import { Input } from '@/components/ui/input';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function TagihanTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter,
    namaSiswaFilter,
    setNamaSiswaFilter,
    nisSiswaFilter,
    setNisSiswaFilter,
    waktuFilter,
    jenisFilter,
    setJenisFilter,
    statusFilter,
    setStatusFilter,
    setWaktuFilter
  } = useTagihanTableFilters();

  const handleChangeWaktu = (value: string) => {
    setWaktuFilter(value, { startTransition });
    setPage(1);
  };

  const handleChangeJenis = (value: string) => {
    setJenisFilter(value, { startTransition });
    setPage(1);
  };

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-5'>
      <DataTableSearch
        searchKey='Judul Tagihan'
        searchQuery={namaFilter}
        setSearchQuery={setNamaFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='Nama Siswa'
        searchQuery={namaSiswaFilter}
        setSearchQuery={setNamaSiswaFilter}
        setPage={setPage}
      />
      <DataTableSearch
        searchKey='NIS Siswa'
        searchQuery={nisSiswaFilter}
        setSearchQuery={setNisSiswaFilter}
        setPage={setPage}
      />

      <Select value={jenisFilter} onValueChange={handleChangeJenis}>
        <SelectTrigger>
          <SelectValue placeholder='Pilih Status Tagihan' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='Menunggu Konfirmasi'>
            Menunggu Konfirmasi
          </SelectItem>
          <SelectItem value='LUNAS'>Lunas</SelectItem>
          <SelectItem value='GAGAL'>Gagal</SelectItem>
          <SelectItem value='BUKTI_TIDAK_VALID'>Bukti Tidak Valid</SelectItem>
          <SelectItem value='BELUM_BAYAR'>Belum Bayar</SelectItem>
          <SelectItem value='PENDING'>Pending</SelectItem>{' '}
          <SelectItem value='MENUNGGU_KONFIRMASI'>
            Menunggu Konfirmasi
          </SelectItem>
        </SelectContent>
      </Select>

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
