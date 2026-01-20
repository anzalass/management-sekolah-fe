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
export function useSiswaTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [namaFilter, setNamaFilter] = useQueryState(
    'nama',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [kelas, setKelasFilter] = useQueryState(
    'kelas',
    searchParams.nis.withOptions({ shallow: false }).withDefault('')
  );

  const [nisFilter, setNisFilter] = useQueryState(
    'nis',
    searchParams.nis.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setNamaFilter(null);
    setNisFilter(null);
    setPage(1);
  }, [setSearchQuery, setNamaFilter, setNisFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!namaFilter || !!nisFilter;
  }, [searchQuery, namaFilter, nisFilter]);

  return {
    kelas,
    setKelasFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    namaFilter,
    setNamaFilter,
    nisFilter,
    setNisFilter
  };
}
