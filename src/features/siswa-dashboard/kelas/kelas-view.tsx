'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  UsersIcon,
  CalendarIcon,
  SearchIcon,
  BookOpenIcon,
  Search
} from 'lucide-react';
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

  const {
    data: kelas = [],
    isLoading,
    error
  } = useQuery<Kelas[], unknown>({
    queryKey: ['kelas-mapel'],
    queryFn: fetchKelas,
    enabled: !!session?.user?.token
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

  const filteredKelas = kelas?.filter((k) =>
    k.namaMapel.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md p-6 text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
            <span className='text-2xl'>⚠️</span>
          </div>
          <h3 className='mb-2 text-lg font-semibold text-gray-900'>
            Gagal Memuat Data
          </h3>
          <p className='text-sm text-muted-foreground'>
            Terjadi kesalahan saat mengambil data kelas. Silakan coba lagi.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='bg-blue-800 px-4 pb-8'>
        <div className='mx-auto max-w-6xl'>
          <NavbarSiswa title='Classroom List' />
          <div className='flex items-center justify-center gap-3'>
            <div>
              <p className='text-center text-sm text-blue-100'></p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className='relative z-10 mx-auto -mt-8 mb-6 max-w-6xl px-4'>
        <div className='rounded-2xl bg-white p-4 shadow-xl'>
          <div className='mb-3 flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Cari kelas...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8'>
        {/* Header Section */}

        {/* Class Grid */}
        {filteredKelas.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
            {filteredKelas.map((kelasItem) => (
              <Link
                href={`/siswa/kelas/${kelasItem.id}`}
                key={kelasItem.id}
                className='group'
              >
                <Card className='h-full overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                  {/* Banner Image */}
                  <div className='relative h-40 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600'>
                    <img
                      src={kelasItem.banner}
                      alt={kelasItem.namaMapel}
                      className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                    {/* Floating Badge */}
                    <div className='absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm'>
                      <span className='text-xs font-semibold text-gray-900'>
                        {kelasItem.tahunAjaran}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-5'>
                    <CardTitle className='mb-3 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                      {kelasItem.namaMapel}
                    </CardTitle>

                    <div className='space-y-2.5 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
                          <span className='text-xs font-semibold text-gray-600'>
                            {kelasItem.namaGuru.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className='line-clamp-1 font-medium text-gray-700'>
                          {kelasItem.namaGuru}
                        </span>
                      </div>

                      <div className='flex items-center justify-between pt-2'>
                        <div className='flex items-center gap-1.5'>
                          <CalendarIcon className='h-4 w-4 text-gray-400' />
                          <span className='text-xs'>
                            {kelasItem.tahunAjaran}
                          </span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <UsersIcon className='h-4 w-4 text-gray-400' />
                          <span className='text-xs font-medium'>
                            {kelasItem.totalSiswa} Student
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className='h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className='p-12 text-center shadow-sm'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
              <BookOpenIcon className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Nothing Classroom
            </h3>
            <p className='text-sm text-muted-foreground'>
              {search
                ? `No results found for "${search}". Try a different keyword.`
                : 'No classes available at the moment.'}
            </p>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
