'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
export const CATEGORY_OPTIONS = [
  { value: 'Education', label: 'Education' },
  { value: 'Art', label: 'Art' },
  { value: 'Science', label: 'Science' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Health', label: 'Health' }
];

export function useGuruTemplateTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setPage(1);
  }, [setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery;
  }, [searchQuery]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    searchQuery,
    setSearchQuery
  };
}
