'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Filter, SearchIcon } from 'lucide-react';

type MobileFilterSheetProps = {
  search: string;
  setSearch: (val: string) => void;
  filterTanggal: string;
  setFilterTanggal: (val: string) => void;
  resetFilter: () => void;
};

export default function MobileFilterSheet({
  search,
  setSearch,
  filterTanggal,
  setFilterTanggal,
  resetFilter
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false); // buat handle close/open sheet

  const handleReset = () => {
    resetFilter();
    setOpen(false); // sheet langsung close
  };

  return (
    <div className='block sm:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className='fixed bottom-20 right-4 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg'>
            <Filter className='h-4 w-4' /> Filter
          </button>
        </SheetTrigger>
        <SheetContent side='bottom' className='h-[50%] rounded-t-2xl'>
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>
          <div className='mt-4 space-y-4'>
            <div className='relative'>
              <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari deskripsi...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='relative'>
              <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                type='date'
                value={filterTanggal}
                onChange={(e) => setFilterTanggal(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex justify-between pt-4'>
              <Button variant='outline' onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={() => setOpen(false)}>Terapkan</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
