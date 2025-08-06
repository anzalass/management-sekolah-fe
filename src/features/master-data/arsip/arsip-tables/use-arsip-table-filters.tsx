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
export function useRuangTableFilters() {
  const [namaBerkasFilter, setNamaBerkasFilter] = useQueryState(
    'namaBerkas',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [keteranganFilter, setKeteranganFilter] = useQueryState(
    'keterangan',
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
    setNamaBerkasFilter(null);
    setKeteranganFilter(null);
    setTanggalFilter(null);

    setPage(1);
  }, [setNamaBerkasFilter, setTanggalFilter, setPage, setKeteranganFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!namaBerkasFilter || !!keteranganFilter || !!tanggalFilter;
  }, [namaBerkasFilter, keteranganFilter, tanggalFilter]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    namaBerkasFilter,
    setNamaBerkasFilter,
    keteranganFilter,
    setKeteranganFilter,
    tanggalFilter,
    setTanggalFilter
  };
}
