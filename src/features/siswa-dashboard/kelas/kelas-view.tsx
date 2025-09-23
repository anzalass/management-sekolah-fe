'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  UsersIcon,
  CalendarIcon,
  Search,
  StepBack,
  SearchIcon
} from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import Link from 'next/link';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';

interface Kelas {
  id: number;
  nama: string;
  waliKelas: string;
  tahunAjaran: string;
  jumlahSiswa: number;
  imageUrl: string;
}

export default function KelasView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [kelas, setKelas] = useState<Kelas[]>([]);

  const getData = async () => {
    try {
      const res = await api.get('siswa/kelas-mapel', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      if (res.status === 200) {
        setKelas(res.data.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredKelas = kelas.filter((k: any) =>
    k?.namaMapel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='mx-auto mb-14 space-y-2 sm:space-y-6'>
      <NavbarSiswa title={`Daftar Kelas`} />

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
      {/* Search */}
      {/* Kartu Kelas */}
      <div className='grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filteredKelas.length > 0 ? (
          filteredKelas.map((kelas: any) => (
            <Link href={`/siswa/kelas/${kelas.id}`} key={kelas.id}>
              <Card className='cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md'>
                <img
                  src={kelas.banner}
                  alt={kelas.namaMapel}
                  className='h-32 w-full object-cover'
                />
                <div className='px-2 pt-4 sm:px-6'>
                  <CardTitle className='text-sm font-semibold sm:text-lg'>
                    {kelas.namaMapel}
                  </CardTitle>
                </div>
                <div className='mt-2 space-y-2 px-2 pb-4 text-xs text-muted-foreground sm:px-6'>
                  <p className=''> {kelas.namaGuru}</p>
                  <p className='flex items-center gap-1'>
                    <CalendarIcon className='h-4 w-4' />
                    {kelas.tahunAjaran}
                  </p>
                  <p className='flex items-center gap-1'>
                    <UsersIcon className='h-4 w-4' />
                    {kelas.totalSiswa} - Siswa
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
