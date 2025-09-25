'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function FilterMobile({
  searchValue,
  setSearchValue,
  tanggalValue,
  setTanggalValue
}: {
  searchValue: string;
  setSearchValue: (v: string) => void;
  tanggalValue: string;
  setTanggalValue: (v: string) => void;
}) {
  const handleReset = () => {
    setSearchValue('');
    setTanggalValue('');
  };

  return (
    <div className='block sm:hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <button className='fixed bottom-20 right-4 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg'>
            <Filter className='h-4 w-4' /> Filter
          </button>
        </SheetTrigger>
        <SheetContent side='bottom' className='h-[55%] rounded-t-2xl'>
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>

          <div className='mt-4 space-y-4'>
            <input
              type='text'
              placeholder='Cari...'
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <input
              type='date'
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'
              value={tanggalValue}
              onChange={(e) => setTanggalValue(e.target.value)}
            />

            {/* Tombol */}
            <div className='flex justify-between pt-4'>
              <SheetClose asChild>
                <Button
                  variant='outline'
                  onClick={() => {
                    handleReset();
                  }}
                >
                  Reset
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  onClick={() => {
                    // trigger filter bisa di parent
                    console.log('Filter applied');
                  }}
                >
                  Terapkan
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
