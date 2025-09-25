'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { useState } from 'react';

export default function FilterMobilePelanggaran({
  searchValue,
  setSearchValue,
  tanggalValue,
  setTanggalValue,
  jenisValue,
  setJenisValue
}: {
  searchValue: string;
  setSearchValue: (v: string) => void;
  tanggalValue: string;
  setTanggalValue: (v: string) => void;
  jenisValue: string;
  setJenisValue: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    setSearchValue('');
    setTanggalValue('');
    setJenisValue('');
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false);
  };

  return (
    <div className='block sm:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className='fixed bottom-20 right-4 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg'
          >
            <Filter className='h-4 w-4' /> Filter
          </button>
        </SheetTrigger>
        <SheetContent side='bottom' className='h-[60%] rounded-t-2xl'>
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>

          <div className='mt-4 space-y-4'>
            <Input
              placeholder='Cari judul atau deskripsi...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Input
              type='date'
              value={tanggalValue}
              onChange={(e) => setTanggalValue(e.target.value)}
            />
            <Select onValueChange={setJenisValue} value={jenisValue}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Jenis' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Ringan'>Ringan</SelectItem>
                <SelectItem value='Sedang'>Sedang</SelectItem>
                <SelectItem value='Berat'>Berat</SelectItem>
              </SelectContent>
            </Select>

            <div className='flex justify-between pt-4'>
              <Button variant='outline' onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleApply}>Terapkan</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
