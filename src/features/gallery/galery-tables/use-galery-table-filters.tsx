'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const CATEGORY_OPTIONS = [
  { value: 'Nature', label: 'Nature' },
  { value: 'Urban', label: 'Urban' },
  { value: 'Abstract', label: 'Abstract' },
  { value: 'Art', label: 'Art' },
  { value: 'Photography', label: 'Photography' }
];

export function useGalleryTableFilters() {
  const [imageFilter, setImageFilter] = useQueryState(
    'image',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setImageFilter('');
    setPage(1);
  }, [setImageFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!imageFilter;
  }, [imageFilter]);

  return {
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    imageFilter,
    setImageFilter
  };
}
