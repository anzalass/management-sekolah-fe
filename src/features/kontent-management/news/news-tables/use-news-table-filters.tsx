'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const CATEGORY_OPTIONS = [
  { value: 'Politics', label: 'Politics' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Health', label: 'Health' },
  { value: 'Business', label: 'Business' },
  { value: 'Entertainment', label: 'Entertainment' }
];

export function useNewsTableFilters() {
  // Change titleFilter to searchQuery
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
    setSearchQuery(''); // Reset search query
    setPage(1);
  }, [setSearchQuery, setPage]);

  // Update isAnyFilterActive to check for searchQuery instead of titleFilter
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
