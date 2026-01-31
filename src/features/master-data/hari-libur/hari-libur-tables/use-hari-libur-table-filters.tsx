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
export function useHariLiburTableFilters() {
  const [namaHariFilter, setNamaHariFilter] = useQueryState(
    'namaHari',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [tanggalFilter, setTanggalFilter] = useQueryState(
    'tanggal',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNamaHariFilter(null);
    setTanggalFilter(null);

    setPage(1);
  }, [setNamaHariFilter, setTanggalFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!namaHariFilter || !!tanggalFilter;
  }, [namaHariFilter, tanggalFilter]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    namaHariFilter,
    setNamaHariFilter,

    tanggalFilter,
    setTanggalFilter
  };
}
