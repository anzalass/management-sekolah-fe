'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function usePelanggaranPrestasiTableFilters() {
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

  const [waktuFilter, setWaktuFilter] = useQueryState(
    'waktu',
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
    setSearchQuery('');
    setJenisFilter('');
    setWaktuFilter('');
    setNisFilter('');
    setPage(1);
  }, [setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!nisFilter || !!waktuFilter || !!jenisFilter;
  }, [searchQuery, nisFilter, waktuFilter, jenisFilter]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    searchQuery,
    setSearchQuery,
    nisFilter,
    jenisFilter,
    setJenisFilter,
    setNisFilter,
    waktuFilter,
    setWaktuFilter
  };
}
