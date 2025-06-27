'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

// Category options for filtering
export const CATEGORY_OPTIONS = [
  { value: 'Positive', label: 'Positive' },
  { value: 'Negative', label: 'Negative' },
  { value: 'Neutral', label: 'Neutral' }
];

export function useTestimonialTableFilters() {
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

  // Check if any filter (searchQuery) is active
  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery; // Return true if searchQuery has value
  }, [searchQuery]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    searchQuery, // Renamed variable to searchQuery
    setSearchQuery // Function to update searchQuery
  };
}
