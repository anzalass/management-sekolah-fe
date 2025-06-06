'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const CATEGORY_OPTIONS = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Books', label: 'Books' },
  { value: 'Jewelry', label: 'Jewelry' },
  { value: 'Beauty Products', label: 'Beauty Products' }
];
export function useAnggaranTableFilters() {
  const [namaFilter, setNamaFilter] = useQueryState(
    'nama',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [jumlahFilter, setJumlahFilter] = useQueryState(
    'jumlah',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [tanggalFilter, setTanggalFilter] = useQueryState(
    'tanggal',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [jenisFilter, setJenisFilter] = useQueryState(
    'jenis',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNamaFilter(null);
    setJumlahFilter(null);
    setTanggalFilter(null);
    setJenisFilter(null);
    setPage(1);
  }, [setNamaFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!namaFilter || !!tanggalFilter || !!jumlahFilter || !!jenisFilter;
  }, [namaFilter, tanggalFilter, jumlahFilter, jenisFilter]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    namaFilter,
    setNamaFilter,
    jumlahFilter,
    setJumlahFilter,
    tanggalFilter,
    setTanggalFilter,
    jenisFilter,
    setJenisFilter
  };
}
