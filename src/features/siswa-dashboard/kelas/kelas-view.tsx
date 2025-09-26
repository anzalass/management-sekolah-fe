'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UsersIcon, CalendarIcon, SearchIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import Link from 'next/link';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import Loading from '../loading';

interface Kelas {
  id: number;
  namaMapel: string;
  namaGuru: string;
  tahunAjaran: string;
  totalSiswa: number;
  banner: string;
}

export default function KelasView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');

  // Fungsi fetch data
  const fetchKelas = async (): Promise<Kelas[]> => {
    if (!session?.user?.token) return [];
    const res = await api.get('siswa/kelas-mapel', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.token}`
      }
    });
    return res.data.data as Kelas[];
  };

  // React Query
  const {
    data: kelas = [],
    isLoading,
    error
  } = useQuery<Kelas[], unknown>({
    queryKey: ['kelas-mapel'],
    queryFn: fetchKelas,
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 30 // cache 5 menit
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

  // Filter search
  const filteredKelas = kelas?.filter((k: any) =>
    k.namaMapel.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <Loading />;
  if (error)
    return (
      <p className='p-4 text-center text-sm text-red-500'>Gagal memuat data</p>
    );

  return (
    <div className='mx-auto mb-14 space-y-2 sm:space-y-6'>
      <NavbarSiswa title='Daftar Kelas' />

      <div className='p-4'>
        <div className='relative w-full sm:w-72'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari Mata Pelajaran...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filteredKelas.length > 0 ? (
          filteredKelas.map((kelasItem: any) => (
            <Link href={`/siswa/kelas/${kelasItem.id}`} key={kelasItem.id}>
              <Card className='cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md'>
                <img
                  src={kelasItem.banner}
                  alt={kelasItem.namaMapel}
                  className='h-32 w-full object-cover'
                />
                <div className='px-2 pt-4 sm:px-6'>
                  <CardTitle className='text-sm font-semibold sm:text-lg'>
                    {kelasItem.namaMapel}
                  </CardTitle>
                </div>
                <div className='mt-2 space-y-2 px-2 pb-4 text-xs text-muted-foreground sm:px-6'>
                  <p>{kelasItem.namaGuru}</p>
                  <p className='flex items-center gap-1'>
                    <CalendarIcon className='h-4 w-4' />
                    {kelasItem.tahunAjaran}
                  </p>
                  <p className='flex items-center gap-1'>
                    <UsersIcon className='h-4 w-4' />
                    {kelasItem.totalSiswa} Siswa
                  </p>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada kelas ditemukan.
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
