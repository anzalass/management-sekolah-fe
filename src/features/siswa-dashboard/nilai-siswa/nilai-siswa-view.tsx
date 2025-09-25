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
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import MobileNilaiFilterSheet from './filter-mobile-nilai-siswa';

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
  const [filterLastWeek, setFilterLastWeek] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data: session } = useSession();

  // Fetch data function
  const fetchNilai = async (): Promise<Nilai[]> => {
    if (!session?.user?.token) return [];
    const res = await api.get('siswa/nilai', {
      headers: { Authorization: `Bearer ${session.user.token}` }
    });
    return res.data.data;
  };

  const {
    data: nilaiSiswa = [],
    isLoading,
    error
  } = useQuery<Nilai[]>({
    queryKey: ['nilai-siswa'],
    queryFn: fetchNilai,
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 20
  });

  // Tangani error di return statement
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memuat data'
      );
    }
  }, [error]);

  // Filtered data
  const filteredData = nilaiSiswa.filter((n: any) => {
    const nilaiDate = new Date(n.createdAt);

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

  if (isLoading) return <p className='p-4 text-center'>Loading data...</p>;
  if (error)
    return <p className='p-4 text-center text-red-500'>Gagal memuat data</p>;

  return (
    <div className='mb-14 space-y-2 sm:space-y-6'>
      <NavbarSiswa title='Nilai Siswa' />

      <div className='p-2'>
        <CardHeader className='hidden flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:flex'>
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
                  filteredData.map((n: any) => (
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
      </div>
      <MobileNilaiFilterSheet
        search={search}
        setSearch={setSearch}
        filterLastWeek={filterLastWeek}
        setFilterLastWeek={setFilterLastWeek}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onReset={() => {
          setSearch('');
          setFilterLastWeek(false);
          setStartDate('');
          setEndDate('');
        }}
      />

      <BottomNav />
    </div>
  );
}
