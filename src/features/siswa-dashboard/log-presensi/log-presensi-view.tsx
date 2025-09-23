'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, CalendarIcon, StepBack, Timer } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';

export default function LogPresensiView() {
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [filterKeterangan, setFilterKeterangan] = useState('');
  const { data: session } = useSession();

  const [presensi, setPresensi] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await api.get('siswa/presensi', {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`
      }
    });
    setPresensi(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = presensi.filter((item) => {
    const dateObj = new Date(item.waktu);
    const dateOnly = dateObj.toISOString().split('T')[0];
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // bulan (01–12)
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

  // generate pilihan tahun dari data
  const tahunList = Array.from(
    new Set(presensi.map((i) => new Date(i.waktu).getFullYear().toString()))
  );

  // Hitung total berdasarkan keterangan dari hasil filter
  const summary = filtered.reduce(
    (acc, item) => {
      if (item.keterangan === 'Hadir') acc.hadir++;
      else if (item.keterangan === 'Sakit') acc.sakit++;
      else if (item.keterangan === 'Izin') acc.izin++;
      else if (item.keterangan === 'Alpha') acc.alpha++;
      else acc.tanpa++;

      return acc;
    },
    { hadir: 0, sakit: 0, izin: 0, alpha: 0, tanpa: 0 }
  );

  return (
    <div className='mx-auto mb-14 w-full space-y-6'>
      {/* Header */}
      <NavbarSiswa title='Log Presensi' />
      {/* Filter */}
      <div className='grid w-full grid-cols-1 gap-3 p-4 sm:w-[70%] sm:grid-cols-2 md:grid-cols-5'>
        {/* Tanggal */}
        <div className='relative'>
          <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            type='date'
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Bulan */}
        <Select value={filterBulan} onValueChange={setFilterBulan}>
          <SelectTrigger>
            <SelectValue placeholder='Pilih Bulan' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='01'>Januari</SelectItem>
            <SelectItem value='02'>Februari</SelectItem>
            <SelectItem value='03'>Maret</SelectItem>
            <SelectItem value='04'>April</SelectItem>
            <SelectItem value='05'>Mei</SelectItem>
            <SelectItem value='06'>Juni</SelectItem>
            <SelectItem value='07'>Juli</SelectItem>
            <SelectItem value='08'>Agustus</SelectItem>
            <SelectItem value='09'>September</SelectItem>
            <SelectItem value='10'>Oktober</SelectItem>
            <SelectItem value='11'>November</SelectItem>
            <SelectItem value='12'>Desember</SelectItem>
          </SelectContent>
        </Select>

        {/* Tahun pakai input number */}
        <Input
          type='number'
          placeholder='Tahun'
          value={filterTahun}
          onChange={(e) => setFilterTahun(e.target.value)}
          className='w-full'
        />

        {/* Keterangan */}
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

        {/* Reset Button */}
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
        <span className='text-gray-600'>Tanpa Keterangan: {summary.tanpa}</span>
      </div>

      {/* Daftar Presensi */}
      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <Card key={item.id} className='shadow-sm'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>
                  {new Date(item?.waktu).toLocaleDateString('id-ID', {
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
                      {new Date(item?.waktu).toLocaleTimeString('id-ID', {
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
      <BottomNav />
    </div>
  );
}
