'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useRiwayatPembayaranTableFilters() {
  const [namaFilter, setNamaFilter] = useQueryState(
    'nama', // API expects "title" for nama
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [namaSiswaFilter, setNamaSiswaFilter] = useQueryState(
    'namaSiswa',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [nisSiswaFilter, setNisSiswaFilter] = useQueryState(
    'nisSiswa',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [waktuFilter, setWaktuFilter] = useQueryState(
    'waktu',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    'limit',
    searchParams.page.withDefault(10)
  );

  const resetFilters = useCallback(() => {
    setNamaFilter(null);
    setNamaSiswaFilter(null);
    setNisSiswaFilter(null);
    setWaktuFilter(null);
    setPage(1);
    setLimit(10);
  }, [
    setNamaFilter,
    setNamaSiswaFilter,
    setNisSiswaFilter,
    setWaktuFilter,
    setPage,
    setLimit
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!namaFilter || !!namaSiswaFilter || !!nisSiswaFilter || !!waktuFilter
    );
  }, [namaFilter, namaSiswaFilter, nisSiswaFilter, waktuFilter]);

  return {
    page,
    setPage,
    limit,
    setLimit,
    resetFilters,
    isAnyFilterActive,
    namaFilter,
    setNamaFilter,
    namaSiswaFilter,
    setNamaSiswaFilter,
    nisSiswaFilter,
    setNisSiswaFilter,
    waktuFilter,
    setWaktuFilter
  };
}
