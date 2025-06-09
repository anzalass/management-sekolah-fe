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
export function usePendaftaranTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [studentName, setStudentName] = useQueryState(
    'studentName',
    searchParams.q.withOptions({ shallow: false }).withDefault('')
  );

  const [parentName, setParentName] = useQueryState(
    'parentName',
    searchParams.nip.withOptions({ shallow: false }).withDefault('')
  );

  const [yourLocation, setYourLocation] = useQueryState(
    'yourLocation',
    searchParams.nip.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStudentName(null);
    setYourLocation(null);
    setPage(1);
  }, [setSearchQuery, setStudentName, setYourLocation, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!studentName || !!parentName || !!yourLocation;
  }, [searchQuery, studentName, parentName]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    studentName,
    setStudentName,
    parentName,
    setParentName,
    yourLocation,
    setYourLocation
  };
}
