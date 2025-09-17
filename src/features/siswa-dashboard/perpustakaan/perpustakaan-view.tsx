'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SearchIcon, StepBack } from 'lucide-react';

export default function PerpustakaanView() {
  const [search, setSearch] = useState('');

  // Dummy data
  const bukuData = [
    {
      id: '1',
      nama: 'Belajar React',
      cover: 'https://via.placeholder.com/100x150.png?text=React',
      filepdf: 'https://example.com/react.pdf',
      pengarang: 'John Doe',
      penerbit: 'Erlangga',
      tahunTerbit: 2022,
      keterangan: 'Buku panduan lengkap belajar React.',
      stok: 10
    },
    {
      id: '2',
      nama: 'Dasar Pemrograman JavaScript',
      cover: 'https://via.placeholder.com/100x150.png?text=JS',
      filepdf: null,
      pengarang: 'Jane Smith',
      penerbit: 'Gramedia',
      tahunTerbit: 2021,
      keterangan: 'Mengenal dasar-dasar JavaScript untuk pemula.',
      stok: 5
    },
    {
      id: '3',
      nama: 'Database dengan Prisma',
      cover: 'https://via.placeholder.com/100x150.png?text=Prisma',
      filepdf: 'https://example.com/prisma.pdf',
      pengarang: 'Ali Ahmad',
      penerbit: 'Informatika',
      tahunTerbit: 2023,
      keterangan: 'Panduan lengkap penggunaan Prisma ORM.',
      stok: 7
    }
  ];

  // Filter sesuai search
  const filtered = bukuData.filter((buku) =>
    buku.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='mx-auto w-full space-y-6'>
      {/* Header */}
      <div className='relative flex h-[10vh] w-full items-center justify-between rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-1 text-white hover:opacity-80'
        >
          <StepBack />
        </button>
        <h1 className='text-lg font-semibold'>Daftar Buku Perpustakaan</h1>
        <div className='h-10 w-10 overflow-hidden rounded-full border-2 border-white'>
          <Image
            src={`https://ui-avatars.com/api/?name=U+D&background=random&format=png`}
            alt='Foto User'
            width={100}
            height={100}
            className='h-full w-full object-cover'
          />
        </div>
      </div>

      {/* Search */}
      <div className='p-4'>
        <div className='relative w-full sm:w-[30%]'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari Buku...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* List Buku */}
      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3'>
        {filtered.map((buku) => (
          <Card
            key={buku.id}
            className='flex border shadow-sm transition hover:shadow-md'
          >
            {/* Cover di kiri */}
            <div className='h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border'>
              {buku.cover ? (
                <Image
                  src={buku.cover}
                  alt={buku.nama}
                  width={100}
                  height={150}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400'>
                  No Cover
                </div>
              )}
            </div>

            {/* Detail di kanan */}
            <div className='flex flex-1 flex-col justify-between p-4'>
              <div>
                <CardTitle className='text-base font-semibold'>
                  {buku.nama}
                </CardTitle>
                <p className='text-xs text-muted-foreground'>
                  {buku.pengarang} - {buku.penerbit} ({buku.tahunTerbit})
                </p>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {buku.keterangan}
                </p>
              </div>

              <div className='mt-2 flex items-center justify-between text-sm text-muted-foreground'>
                <span>
                  <span className='font-medium text-gray-700'>Stok: </span>
                  {buku.stok}
                </span>
                {buku.filepdf && (
                  <a
                    href={buku.filepdf}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    Lihat PDF
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
