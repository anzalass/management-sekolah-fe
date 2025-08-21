'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useRiwayatPembayaranTableFilters } from './use-riwayat-pembayaran-table-filters';
import { Input } from '@/components/ui/input';
import { useTransition } from 'react';

export default function RiwayatPembayaranTableAction() {
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
    setWaktuFilter
  } = useRiwayatPembayaranTableFilters();

  const handleChangeWaktu = (value: string) => {
    setWaktuFilter(value, { startTransition });
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

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
