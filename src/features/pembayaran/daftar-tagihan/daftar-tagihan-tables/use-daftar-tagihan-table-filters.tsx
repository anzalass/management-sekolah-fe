'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useTagihanTableFilters() {
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

  const [jenisFilter, setJenisFilter] = useQueryState(
    'jenis',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
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
    setJenisFilter(null);
    setStatusFilter(null);
    setPage(1);
    setLimit(10);
  }, [
    setNamaFilter,
    setNamaSiswaFilter,
    setNisSiswaFilter,
    setWaktuFilter,
    setPage,
    setStatusFilter,
    setLimit,
    setJenisFilter
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!namaFilter ||
      !!namaSiswaFilter ||
      !statusFilter ||
      !!nisSiswaFilter ||
      !!waktuFilter
    );
  }, [namaFilter, statusFilter, namaSiswaFilter, nisSiswaFilter, waktuFilter]);

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
    jenisFilter,
    setJenisFilter,
    statusFilter,
    setStatusFilter,
    waktuFilter,
    setWaktuFilter
  };
}
