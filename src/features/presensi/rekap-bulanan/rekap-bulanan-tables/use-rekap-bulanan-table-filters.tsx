'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useRekapBulananTableFilters() {
  const [namaFilter, setNamaFilter] = useQueryState(
    'nama',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [nipFilter, setNipFilter] = useQueryState(
    'nip',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNamaFilter(null);
    setNipFilter(null);

    setPage(1);
  }, [setNamaFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!namaFilter || !!nipFilter;
  }, [namaFilter, nipFilter]);

  return {
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
