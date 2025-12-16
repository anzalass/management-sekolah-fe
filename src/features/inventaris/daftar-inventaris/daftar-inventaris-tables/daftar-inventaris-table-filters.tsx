'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useDaftarInventarisTableFilters() {
  const [namaFilter, setNamaFilter] = useQueryState(
    'nama',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [ruangFilter, setRuangFilter] = useQueryState(
    'ruang',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [waktuPengadaanFilter, setWaktuPengadaanFilter] = useQueryState(
    'waktuPengadaan',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );
  const [hargaBeliFilter, setHargaBeliFilter] = useQueryState(
    'hargaBeli',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNamaFilter(null);
    setHargaBeliFilter(null);
    setWaktuPengadaanFilter(null);
    setRuangFilter(null);
    setPage(1);
  }, [setNamaFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!namaFilter ||
      !!hargaBeliFilter ||
      !!waktuPengadaanFilter ||
      !!ruangFilter
    );
  }, [namaFilter, hargaBeliFilter, waktuPengadaanFilter, ruangFilter]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    namaFilter,
    setNamaFilter,
    hargaBeliFilter,
    setHargaBeliFilter,
    waktuPengadaanFilter,
    setWaktuPengadaanFilter,
    ruangFilter,
    setRuangFilter
  };
}
