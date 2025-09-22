'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { SearchIcon, Sparkles, StepBack } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';

const prestasiDummy = [
  {
    id: 1,
    judul: 'Juara 1 Olimpiade Matematika',
    deskripsi:
      'Mewakili sekolah dalam ajang Olimpiade Matematika tingkat kota.',
    tanggal: '2025-05-14'
  },
  {
    id: 2,
    judul: 'Lomba Cerdas Cermat',
    deskripsi: 'Tim XII IPA 1 berhasil meraih juara 2 tingkat provinsi.',
    tanggal: '2025-03-22'
  },
  {
    id: 3,
    judul: 'Penghargaan Siswa Teladan',
    deskripsi: 'Diberikan karena prestasi akademik dan kedisiplinan tinggi.',
    tanggal: '2025-01-10'
  }
];

export default function PrestasiView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [prestasi, setPrestasi] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await api.get('siswa/prestasi', {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`
      }
    });
    setPrestasi(res.data.data);

    console.log(res.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const filtered = prestasi.filter((p) =>
    p.keterangan.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className='mx-auto w-full space-y-6'>
      <BottomNav />

      <NavbarSiswa title='Prestasi Siswa' />

      <div className='p-4'>
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

      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3'>
        {filtered.map((item, i) => (
          <Card key={item.id} className='border shadow-sm'>
            <CardHeader className='flex justify-between'>
              <CardTitle className='flex gap-2 text-lg'>
                <Sparkles className='h-5 text-yellow-500' />
                Prestasi : {i + 1}
              </CardTitle>
              <span className='w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700'>
                <p>
                  {' '}
                  {new Date(item?.waktu).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>{' '}
              </span>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              {item.keterangan}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
