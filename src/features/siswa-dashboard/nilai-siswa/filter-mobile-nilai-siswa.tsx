'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Filter, Search } from 'lucide-react';

type MobileNilaiFilterSheetProps = {
  search: string;
  setSearch: (val: string) => void;
  filterLastWeek: boolean;
  setFilterLastWeek: (val: boolean) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  onReset: () => void;
};

export default function MobileNilaiFilterSheet({
  search,
  setSearch,
  filterLastWeek,
  setFilterLastWeek,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset
}: MobileNilaiFilterSheetProps) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  return (
    <div className='block md:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className='fixed bottom-20 right-4 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg'>
            <Filter className='h-4 w-4' /> Filter
          </button>
        </SheetTrigger>
        <SheetContent side='bottom' className='h-[60%] rounded-t-2xl'>
          <SheetHeader>
            <SheetTitle>Filter Nilai</SheetTitle>
          </SheetHeader>
          <div className='mt-4 space-y-4'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari Mapel / Guru / Jenis Nilai...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9'
              />
            </div>

            {/* Filter minggu terakhir */}
            <button
              onClick={() => setFilterLastWeek(!filterLastWeek)}
              className={`w-full rounded px-4 py-2 text-sm font-medium transition-colors ${
                filterLastWeek
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterLastWeek
                ? 'Hapus Filter Minggu Terakhir'
                : 'Filter Minggu Terakhir'}
            </button>

            {/* Filter tanggal */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='relative'>
                <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='pl-10'
                />
              </div>
              <div className='relative'>
                <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='pl-10'
                />
              </div>
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
