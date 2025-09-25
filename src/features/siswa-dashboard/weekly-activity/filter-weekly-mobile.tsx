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

type Props = {
  searchContent: string;
  setSearchContent: (val: string) => void;
  searchDate: string;
  setSearchDate: (val: string) => void;
  onReset: () => void;
};

export default function WeeklyActivityFilterMobile({
  searchContent,
  setSearchContent,
  searchDate,
  setSearchDate,
  onReset
}: Props) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    onReset();
    setOpen(false);
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
            <SheetTitle>Filter Weekly Activity</SheetTitle>
          </SheetHeader>

          <div className='mt-4 space-y-4'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari konten...'
                value={searchContent}
                onChange={(e) => setSearchContent(e.target.value)}
                className='pl-9'
              />
            </div>

            {/* Date */}
            <div className='relative'>
              <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                type='date'
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
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
