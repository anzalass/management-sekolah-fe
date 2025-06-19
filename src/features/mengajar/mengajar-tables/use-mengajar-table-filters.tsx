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
export function useMengajarTableFilters() {
  const [namaMapelFilter, setNamaMapelFilter] = useQueryState(
    'namaMapel',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [ruangKelasFilter, setRuangKelasFilter] = useQueryState(
    'ruangKelas',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [waktuMengajarFilter, setwaktuMengajarFilter] = useQueryState(
    'waktuMengajar',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [tahunAjaranFilter, settahunAjaranFilter] = useQueryState(
    'tahunAjaran',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setNamaMapelFilter(null);
    setRuangKelasFilter(null);
    setwaktuMengajarFilter(null);
    settahunAjaranFilter(null);
    setPage(1);
  }, [setNamaMapelFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!namaMapelFilter ||
      !!ruangKelasFilter ||
      !!waktuMengajarFilter ||
      !!tahunAjaranFilter
    );
  }, [
    namaMapelFilter,
    ruangKelasFilter,
    waktuMengajarFilter,
    tahunAjaranFilter
  ]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    namaMapelFilter,
    ruangKelasFilter,
    waktuMengajarFilter,
    tahunAjaranFilter,
    setNamaMapelFilter,
    setRuangKelasFilter,
    setwaktuMengajarFilter,
    settahunAjaranFilter
  };
}
