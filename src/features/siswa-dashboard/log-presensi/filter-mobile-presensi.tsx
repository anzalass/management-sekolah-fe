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

export default function FilterMobileLogPresensi({
  tanggalValue,
  setTanggalValue,
  bulanValue,
  setBulanValue,
  tahunValue,
  setTahunValue,
  tahunList,
  keteranganValue,
  setKeteranganValue
}: {
  tanggalValue: string;
  setTanggalValue: (v: string) => void;
  bulanValue: string;
  setBulanValue: (v: string) => void;
  tahunValue: string;
  setTahunValue: (v: string) => void;
  tahunList: string[];
  keteranganValue: string;
  setKeteranganValue: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    setTanggalValue('');
    setBulanValue('');
    setTahunValue('');
    setKeteranganValue('');
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false); // sheet otomatis nutup
  };

  return (
    <div className='block sm:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className='fixed bottom-24 right-6 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-white shadow-lg'
          >
            <Filter className='h-4 w-4' /> Filter
          </button>
        </SheetTrigger>
        <SheetContent
          side='bottom'
          className='h-[65%] overflow-y-auto rounded-t-2xl'
        >
          <SheetHeader>
            <SheetTitle>Filter Presensi</SheetTitle>
          </SheetHeader>

          <div className='mt-4 space-y-4'>
            {/* Tanggal */}
            <Input
              type='date'
              value={tanggalValue}
              onChange={(e) => setTanggalValue(e.target.value)}
            />

            {/* Bulan */}
            <Select value={bulanValue} onValueChange={setBulanValue}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih Bulan' />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const bulan = (i + 1).toString().padStart(2, '0');
                  const namaBulan = new Date(2000, i).toLocaleString('id-ID', {
                    month: 'long'
                  });
                  return (
                    <SelectItem key={bulan} value={bulan}>
                      {namaBulan}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Tahun */}

            <Input
              type='number'
              value={tahunValue}
              onChange={(e) => setTahunValue(e.target.value)}
            />

            {/* Keterangan */}
            <Select value={keteranganValue} onValueChange={setKeteranganValue}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih Keterangan' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Hadir'>Hadir</SelectItem>
                <SelectItem value='Sakit'>Sakit</SelectItem>
                <SelectItem value='Izin'>Izin</SelectItem>
                <SelectItem value='Alpha'>Alpha</SelectItem>
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
