'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useKonselingTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'nama',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [nisFilter, setNisFilter] = useQueryState(
    'nis',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
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
    setSearchQuery('');
    setNisFilter('');
    setTanggalFilter('');
    setPage(1);
  }, [setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!nisFilter || !!tanggalFilter;
  }, [searchQuery, nisFilter, tanggalFilter]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    searchQuery,
    setSearchQuery,
    nisFilter,
    setNisFilter,
    tanggalFilter,
    setTanggalFilter
  };
}
