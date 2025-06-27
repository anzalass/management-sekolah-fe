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

interface Pelanggaran {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string; // format: YYYY-MM-DD
  jenis: 'Ringan' | 'Sedang' | 'Berat';
}

const dummyPelanggaran: Pelanggaran[] = [
  {
    id: 1,
    judul: 'Terlambat Masuk Sekolah',
    deskripsi: 'Datang ke sekolah lebih dari pukul 07.30.',
    tanggal: '2025-06-17',
    jenis: 'Ringan'
  },
  {
    id: 2,
    judul: 'Tidak Menggunakan Seragam',
    deskripsi: 'Tidak memakai seragam sesuai hari yang ditentukan.',
    tanggal: '2025-06-15',
    jenis: 'Sedang'
  },
  {
    id: 3,
    judul: 'Bolos Sekolah',
    deskripsi: 'Tidak hadir tanpa keterangan selama 2 hari.',
    tanggal: '2025-06-12',
    jenis: 'Berat'
  },
  {
    id: 4,
    judul: 'Membuang Sampah Sembarangan',
    deskripsi: 'Ditemukan membuang sampah di halaman sekolah.',
    tanggal: '2025-06-10',
    jenis: 'Ringan'
  }
];

export default function PelanggaranView() {
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterJenis, setFilterJenis] = useState('');

  const filtered = dummyPelanggaran
    .filter(
      (p) =>
        p.judul.toLowerCase().includes(search.toLowerCase()) ||
        p.deskripsi.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (filterTanggal ? p.tanggal === filterTanggal : true))
    .filter((p) => (filterJenis ? p.jenis === filterJenis : true));

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div>
        <h1 className='text-2xl font-bold'>Riwayat Pelanggaran</h1>
        <p className='text-sm text-muted-foreground'>
          Daftar pelanggaran yang pernah dilakukan siswa, berdasarkan kategori
          dan tanggal.
        </p>
      </div>

      {/* Filter */}
      <div className='flex flex-col gap-4 sm:flex-row'>
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

      {/* List Pelanggaran */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <Card key={item.id} className='border shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{item.judul}</CardTitle>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.jenis === 'Berat'
                        ? 'bg-red-100 text-red-600'
                        : item.jenis === 'Sedang'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.jenis}
                  </span>
                </div>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>{item.deskripsi}</p>
                <p className='text-right text-xs font-medium text-primary'>
                  {item.tanggal}
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
    </div>
  );
}
