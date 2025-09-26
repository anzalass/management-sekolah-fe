'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { SearchIcon, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Prestasi {
  id: number;
  keterangan: string;
  waktu: string;
}

export default function PrestasiView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');

  const {
    data: prestasi = [],
    isLoading,
    error
  } = useQuery<Prestasi[]>({
    queryKey: ['prestasi-siswa'],
    queryFn: async () => {
      if (!session?.user?.token) return [];
      const res = await api.get('siswa/prestasi', {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 5 // cache 5 menit
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

  const filtered = prestasi.filter((p) =>
    p.keterangan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='mx-auto mb-14 w-full space-y-3'>
      <NavbarSiswa title='Prestasi Siswa' />

      <div className='px-4'>
        <div className='relative w-full sm:w-[30%]'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari Prestasi...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {isLoading ? (
        <p className='p-4 text-center'>Loading prestasi...</p>
      ) : error ? (
        <p className='p-4 text-center text-red-500'>Gagal memuat prestasi</p>
      ) : (
        <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3'>
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <Card key={item.id} className='border shadow-sm'>
                <CardHeader className='flex justify-between'>
                  <CardTitle className='flex gap-2 text-lg'>
                    <Sparkles className='h-5 text-yellow-500' />
                    Prestasi : {i + 1}
                  </CardTitle>
                  <span className='w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700'>
                    {new Date(item.waktu).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                  {item.keterangan}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className='col-span-full text-center text-sm text-muted-foreground'>
              Tidak ada prestasi ditemukan.
            </p>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
