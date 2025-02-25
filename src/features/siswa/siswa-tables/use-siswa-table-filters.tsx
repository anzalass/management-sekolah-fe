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
    searchParams.nip.withOptions({ shallow: false }).withDefault('')
  );

  const [nipFilter, setNipFilter] = useQueryState(
    'nip',
    searchParams.nip.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setNamaFilter(null);
    setNipFilter(null);
    setPage(1);
  }, [setSearchQuery, setNamaFilter, setNipFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!namaFilter || !!nipFilter;
  }, [searchQuery, namaFilter, nipFilter]);

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
    nipFilter,
    setNipFilter
  };
}
