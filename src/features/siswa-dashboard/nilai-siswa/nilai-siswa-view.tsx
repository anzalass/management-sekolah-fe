'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, StepBack } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

interface Nilai {
  id: string;
  nilai: number;
  jenisNilai: string;
  bobot: number;
  mapel: string;
  guru: string;
  kelas: string;
  tahunAjaran: string;
  createdAt: string;
}

export default function NilaiSiswaView() {
  const [search, setSearch] = useState('');
  const [nilaiSiswa, setNilaiSiswa] = useState<Nilai[]>([]);
  const [filterLastWeek, setFilterLastWeek] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data: session } = useSession();

  const getNilai = async () => {
    try {
      const res = await api.get(`siswa/nilai`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      if (res.status === 200) {
        setNilaiSiswa(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNilai();
  }, [session]);

  const filteredData = nilaiSiswa.filter((n) => {
    const nilaiDate = new Date(n.createdAt as string);

    const matchesSearch =
      n.mapel.toLowerCase().includes(search.toLowerCase()) ||
      n.guru.toLowerCase().includes(search.toLowerCase()) ||
      n.jenisNilai.toLowerCase().includes(search.toLowerCase());

    let matchesDate = true;

    if (filterLastWeek) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesDate = nilaiDate >= sevenDaysAgo;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesDate = nilaiDate >= start && nilaiDate <= end;
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className='space-y-6'>
      <div className='relative flex h-[10vh] w-full items-center justify-between rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-1 text-white hover:opacity-80'
        >
          <StepBack />
        </button>
        <h1 className='text-lg font-semibold'>Nilai Siswa</h1>
        <div className='h-10 w-10 overflow-hidden rounded-full border-2 border-white'>
          <Image
            src={`https://ui-avatars.com/api/?name=${
              session?.user?.nama?.split(' ')[0]?.[0] || ''
            }+${session?.user?.nama?.split(' ')[1]?.[0] || ''}&background=random&format=png`}
            alt='Foto User'
            width={100}
            height={100}
            className='h-full w-full object-cover'
          />
        </div>
      </div>

      <div className='p-6'>
        <Card className='shadow-md'>
          <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle className='text-xl font-bold'>
              📊 Daftar Nilai Siswa
            </CardTitle>

            <div className='flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center'>
              {/* Filter minggu terakhir */}
              <button
                onClick={() => setFilterLastWeek(!filterLastWeek)}
                className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
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
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
                  <label className='text-sm text-gray-600'>Dari:</label>
                  <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='rounded border px-2 py-1 text-sm'
                  />
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
                  <label className='text-sm text-gray-600'>Sampai:</label>
                  <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='rounded border px-2 py-1 text-sm'
                  />
                </div>
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className='rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300'
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className='relative w-full sm:w-64'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Cari Mapel / Guru / Jenis Nilai...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-9'
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className='w-full overflow-x-auto'>
              <Table className='min-w-[800px]'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mapel</TableHead>
                    <TableHead>Guru</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tahun Ajaran</TableHead>
                    <TableHead>Jenis Nilai</TableHead>
                    <TableHead>Bobot</TableHead>
                    <TableHead>Nilai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((n) => (
                      <TableRow key={n.id}>
                        <TableCell className='font-medium'>{n.mapel}</TableCell>
                        <TableCell>{n.guru}</TableCell>
                        <TableCell>{n.kelas}</TableCell>
                        <TableCell>{n.tahunAjaran}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              n.jenisNilai === 'UAS'
                                ? 'destructive'
                                : n.jenisNilai === 'UTS'
                                  ? 'secondary'
                                  : 'default'
                            }
                          >
                            {n.jenisNilai}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{n.bobot}%</Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${
                              n.nilai >= 85
                                ? 'text-green-600'
                                : n.nilai >= 70
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {n.nilai}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className='text-center text-muted-foreground'
                      >
                        Tidak ada data ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
