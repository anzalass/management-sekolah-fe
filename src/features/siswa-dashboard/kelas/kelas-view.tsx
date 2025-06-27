'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UsersIcon, CalendarIcon, Search } from 'lucide-react';

interface Kelas {
  id: number;
  nama: string;
  waliKelas: string;
  tahunAjaran: string;
  jumlahSiswa: number;
  imageUrl: string;
}

const dummyKelas: Kelas[] = [
  {
    id: 1,
    nama: 'Fisika XII IPA 1',
    waliKelas: 'Bu Rina',
    tahunAjaran: '2024/2025',
    jumlahSiswa: 32,
    imageUrl:
      'https://images.unsplash.com/photo-1749741326969-e1676b3bce43?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Fisika
  },
  {
    id: 2,
    nama: 'Bahasa Indonesia XII IPS 2',
    waliKelas: 'Pak Budi',
    tahunAjaran: '2024/2025',
    jumlahSiswa: 28,
    imageUrl:
      'https://images.unsplash.com/photo-1749741326969-e1676b3bce43?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    nama: 'Biologi XI IPA 3',
    waliKelas: 'Bu Sari',
    tahunAjaran: '2024/2025',
    jumlahSiswa: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1749741326969-e1676b3bce43?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Biologi
  },
  {
    id: 4,
    nama: 'PPKN X IPS 1',
    waliKelas: 'Pak Andi',
    tahunAjaran: '2024/2025',
    jumlahSiswa: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1749741326969-e1676b3bce43?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Pendidikan / Hukum
  }
];

export default function KelasView() {
  const [search, setSearch] = useState('');
  const filteredKelas = dummyKelas.filter((k) =>
    k.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div>
        <h1 className='text-2xl font-bold'>Daftar Kelas</h1>
        <p className='text-sm text-muted-foreground'>
          Lihat daftar semua kelas aktif beserta wali kelas dan jumlah siswa.
        </p>
      </div>

      {/* Search */}
      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Cari nama kelas...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Kartu Kelas */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {filteredKelas.length > 0 ? (
          filteredKelas.map((kelas) => (
            <Card
              key={kelas.id}
              className='cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md'
            >
              <img
                src={kelas.imageUrl}
                alt={kelas.nama}
                className='h-32 w-full object-cover'
              />
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>
                  {kelas.nama}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>Wali Kelas: {kelas.waliKelas}</p>
                <p className='flex items-center gap-1'>
                  <CalendarIcon className='h-4 w-4' />
                  {kelas.tahunAjaran}
                </p>
                <p className='flex items-center gap-1'>
                  <UsersIcon className='h-4 w-4' />
                  {kelas.jumlahSiswa} siswa
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada kelas ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
