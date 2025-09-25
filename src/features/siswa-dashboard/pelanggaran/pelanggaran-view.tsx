'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { CalendarIcon, SearchIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';
import FilterMobilePelanggaran from './pelanggaran-filter-mobile';
import { useQuery } from '@tanstack/react-query';

export default function PelanggaranView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterJenis, setFilterJenis] = useState('');

  // React Query Fetcher
  const fetchPelanggaran = async () => {
    const res = await api.get('siswa/pelanggaran', {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`
      }
    });
    return res.data.data;
  };

  const {
    data: pelanggaran = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['pelanggaran', session?.user?.token],
    queryFn: fetchPelanggaran,
    enabled: !!session?.user?.token // fetch hanya kalau token ada
  });

  if (isError) {
    toast.error((error as any)?.response?.data?.message || 'Terjadi kesalahan');
  }

  const filtered = pelanggaran
    .filter((p: any) =>
      p.keterangan.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p: any) => (filterTanggal ? p.tanggal === filterTanggal : true))
    .filter((p: any) => {
      if (!filterJenis) return true;

      if (filterJenis === 'Berat') return p.poin > 70;
      if (filterJenis === 'Sedang') return p.poin > 25 && p.poin <= 70;
      if (filterJenis === 'Ringan') return p.poin <= 25;

      return true;
    });

  return (
    <div className='mx-auto mb-14 w-full space-y-6'>
      <NavbarSiswa title='Pelanggaran ' />

      {/* Filter Desktop */}
      <div className='hidden flex-col gap-4 p-4 sm:flex sm:flex-row'>
        <div className='relative w-full'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari judul atau deskripsi...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='relative w-full sm:max-w-xs'>
          <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            type='date'
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select
          onValueChange={(val) => setFilterJenis(val)}
          value={filterJenis}
        >
          <SelectTrigger className='w-full sm:w-[150px]'>
            <SelectValue placeholder='Jenis' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Ringan'>Ringan</SelectItem>
            <SelectItem value='Sedang'>Sedang</SelectItem>
            <SelectItem value='Berat'>Berat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Mobile */}
      <FilterMobilePelanggaran
        searchValue={search}
        setSearchValue={setSearch}
        tanggalValue={filterTanggal}
        setTanggalValue={setFilterTanggal}
        jenisValue={filterJenis}
        setJenisValue={setFilterJenis}
      />

      {/* List Pelanggaran */}
      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2'>
        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Memuat data...</p>
        ) : filtered.length > 0 ? (
          filtered.map((item: any, i: number) => (
            <Card key={item.id} className='border shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>
                    Pelanggaran : {i + 1}
                  </CardTitle>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.poin >= 70
                        ? 'bg-red-100 text-red-600'
                        : item.poin <= 70 && item.poin >= 25
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.poin >= 70
                      ? 'Berat'
                      : item.poin <= 70 && item.poin >= 25
                        ? 'Sedang'
                        : 'Ringan'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>
                  {new Date(item?.waktu).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p>{item.keterangan}</p>
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
