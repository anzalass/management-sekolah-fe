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
export function useKegiatanSekolahTableFilters() {
  const [namaFilter, setNamaFilter] = useQueryState(
    'nama',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [tahunAjaran, setTahunAjaranFilter] = useQueryState(
    'ta',
    searchParams.nip.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNamaFilter(null);
    setTahunAjaranFilter(null);
    setPage(1);
  }, [setNamaFilter, setTahunAjaranFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!namaFilter || !!tahunAjaran;
  }, [namaFilter, tahunAjaran]);

  return {
    page,
    tahunAjaran,
    setTahunAjaranFilter,
    setPage,
    resetFilters,
    isAnyFilterActive,
    namaFilter,
    setNamaFilter
  };
}
