'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Timer, Book } from 'lucide-react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import FilterMobileLogPresensi from './filter-mobile-presensi';

interface Presensi {
  id: number;
  waktu: string;
  keterangan: 'Hadir' | 'Sakit' | 'Izin' | 'Alpha';
}

export default function LogPresensiView() {
  const { data: session } = useSession();
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [filterKeterangan, setFilterKeterangan] = useState('');

  const {
    data: presensi = [],
    isLoading,
    error
  } = useQuery<Presensi[]>({
    queryKey: ['presensi-siswa'],
    queryFn: async () => {
      if (!session?.user?.token) return [];
      const res = await api.get('siswa/presensi', {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memuat data'
      );
    }
  }, [error]);

  const filtered = presensi.filter((item) => {
    const dateObj = new Date(item.waktu);
    const dateOnly = dateObj.toISOString().split('T')[0];
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();

    return (
      (!filterTanggal || dateOnly === filterTanggal) &&
      (!filterBulan || month === filterBulan) &&
      (!filterTahun || year === filterTahun) &&
      (!filterKeterangan || item.keterangan === filterKeterangan)
    );
  });

  const handleReset = () => {
    setFilterTanggal('');
    setFilterBulan('');
    setFilterTahun('');
    setFilterKeterangan('');
  };

  const tahunList = Array.from(
    new Set(presensi.map((i) => new Date(i.waktu).getFullYear().toString()))
  );

  const summary = filtered.reduce(
    (acc, item) => {
      if (item.keterangan === 'Hadir') acc.hadir++;
      else if (item.keterangan === 'Sakit') acc.sakit++;
      else if (item.keterangan === 'Izin') acc.izin++;
      else if (item.keterangan === 'Alpha') acc.alpha++;
      return acc;
    },
    { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
  );

  return (
    <div className='relative mx-auto mb-14 w-full space-y-2 sm:space-y-6'>
      <NavbarSiswa title='Log Presensi' />

      <FilterMobileLogPresensi
        tanggalValue={filterTanggal}
        setTanggalValue={setFilterTanggal}
        bulanValue={filterBulan}
        setBulanValue={setFilterBulan}
        tahunValue={filterTahun}
        setTahunValue={setFilterTahun}
        tahunList={tahunList}
        keteranganValue={filterKeterangan}
        setKeteranganValue={setFilterKeterangan}
      />

      {/* Filter */}
      <div className='hidden w-full grid-cols-1 gap-3 p-4 sm:grid sm:w-[70%] sm:grid-cols-2 md:grid-cols-5'>
        <div className='relative'>
          <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            type='date'
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className='pl-10'
          />
        </div>

        <Select value={filterBulan} onValueChange={setFilterBulan}>
          <SelectTrigger>
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

        <Select value={filterTahun} onValueChange={setFilterTahun}>
          <SelectTrigger>
            <SelectValue placeholder='Pilih Tahun' />
          </SelectTrigger>
          <SelectContent>
            {tahunList.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterKeterangan} onValueChange={setFilterKeterangan}>
          <SelectTrigger>
            <SelectValue placeholder='Pilih Keterangan' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Hadir'>Hadir</SelectItem>
            <SelectItem value='Sakit'>Sakit</SelectItem>
            <SelectItem value='Izin'>Izin</SelectItem>
            <SelectItem value='Alpha'>Alpha</SelectItem>
          </SelectContent>
        </Select>

        <Button variant='outline' onClick={handleReset}>
          Reset Filter
        </Button>
      </div>

      {/* Summary */}
      <div className='flex flex-wrap gap-4 px-4 text-sm font-medium'>
        <span className='text-green-600'>Hadir: {summary.hadir}</span>
        <span className='text-blue-600'>Sakit: {summary.sakit}</span>
        <span className='text-yellow-600'>Izin: {summary.izin}</span>
        <span className='text-red-600'>Alpha: {summary.alpha}</span>
      </div>

      {/* Daftar Presensi */}
      {isLoading ? (
        <p className='p-4 text-center'>Loading presensi...</p>
      ) : error ? (
        <p className='p-4 text-center text-red-500'>Gagal memuat data</p>
      ) : (
        <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <Card key={item.id} className='shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>
                    {new Date(item.waktu).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 text-sm text-muted-foreground'>
                  <p className='flex items-center gap-2'>
                    <Timer className='h-4 w-4 text-green-500' />
                    Jam :{' '}
                    {item.keterangan === 'Hadir' ? (
                      <span className='font-medium text-foreground'>
                        {new Date(item.waktu).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    ) : (
                      <span className='text-red-500'>-</span>
                    )}
                  </p>
                  <p className='flex items-center gap-2'>
                    <Book className='h-4 w-4 text-blue-500' />
                    Keterangan:{' '}
                    <span
                      className={`${
                        item.keterangan === 'Hadir'
                          ? 'text-green-500'
                          : item.keterangan === 'Sakit'
                            ? 'text-blue-500'
                            : item.keterangan === 'Izin'
                              ? 'text-yellow-500'
                              : 'text-red-500'
                      } font-medium text-foreground`}
                    >
                      {item.keterangan}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>
              Tidak ada data ditemukan.
            </p>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
