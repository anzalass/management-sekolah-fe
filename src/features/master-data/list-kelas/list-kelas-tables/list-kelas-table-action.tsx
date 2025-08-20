'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useAnggaranTableFilters } from './use-list-kelas-table-filters';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTransition } from 'react';

export default function ListKelasTableAction() {
  const [isLoading, startTransition] = useTransition();

  const {
    isAnyFilterActive,

    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = useAnggaranTableFilters();

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      <DataTableSearch
        searchKey='Nama'
        searchQuery={namaFilter}
        setSearchQuery={setNamaFilter}
        setPage={setPage}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
