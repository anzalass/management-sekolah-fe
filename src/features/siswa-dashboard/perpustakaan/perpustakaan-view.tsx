'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SearchIcon, StepBack } from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';

export default function PerpustakaanView() {
  const [search, setSearch] = useState('');
  const { data: session } = useSession();
  const [bukuData, setBukuData] = useState<any[]>([]);

  // Dummy data

  const getData = async () => {
    try {
      const res = await api.get('buku', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setBukuData(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getData();
  }, [session]);

  // Filter sesuai search
  const filtered = bukuData?.filter((buku) =>
    buku.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='mx-auto mb-14 w-full space-y-6'>
      {/* Header */}
      <NavbarSiswa title='Perpustakaan' />

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
        {filtered?.map((buku) => (
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
      <BottomNav />
    </div>
  );
}
