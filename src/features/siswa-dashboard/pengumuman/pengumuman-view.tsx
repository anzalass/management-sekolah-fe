'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, SearchIcon, StepBack } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

interface Pengumuman {
  id: number;
  title: string;
  content: string;
  tanggal: string;
}

const dummyPengumuman: Pengumuman[] = [
  {
    id: 1,
    title: 'Kegiatan Class Meeting',
    content:
      'Class Meeting akan dilaksanakan mulai tanggal 20 Juni 2025. Siswa diharapkan hadir tepat waktu dan mengikuti seluruh kegiatan.',
    tanggal: '2025-06-18'
  },
  {
    id: 2,
    title: 'Pengambilan Raport',
    content:
      'Raport semester genap dapat diambil pada tanggal 25 Juni 2025 oleh orang tua siswa.',
    tanggal: '2025-06-15'
  },
  {
    id: 3,
    title: 'Libur Semester',
    content:
      'Libur semester dimulai tanggal 26 Juni hingga 10 Juli 2025. Kegiatan belajar akan dimulai kembali tanggal 11 Juli.',
    tanggal: '2025-06-10'
  }
];

export default function PengumumanView() {
  const { data: session } = useSession();

  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [pengumuman, setPengumuman] = useState<any[]>([]);

  const getPengumuman = async () => {
    try {
      const res = await api.get('siswa/pengumuman', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setPengumuman(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPengumuman();
  }, [session]);

  const filteredPengumuman = pengumuman
    .filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      if (!filterTanggal) return true;

      // konversi ISO → YYYY-MM-DD
      const dateOnly = new Date(item.time).toISOString().split('T')[0];

      return dateOnly === filterTanggal;
    });

  return (
    <div className='mx-auto space-y-6'>
      <div className='relative flex h-[10vh] w-full items-center justify-between rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        {/* Tombol Back */}
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-1 text-white hover:opacity-80'
        >
          <StepBack />
        </button>

        {/* Title */}
        <h1 className='text-lg font-semibold'>Pengumuman</h1>

        {/* Foto Profil User */}
        <div className='h-10 w-10 overflow-hidden rounded-full border-2 border-white'>
          <Image
            src={`https://ui-avatars.com/api/?name=${
              session?.user?.nama?.split(' ')[0]?.[0] || ''
            }+${session?.user?.nama?.split(' ')[1]?.[0] || ''}&background=random&format=png`}
            alt='Foto User'
            width={100}
            height={100}
            className='h-full w-full object-cover'
          />
        </div>
      </div>

      {/* Filter */}
      <div className='flex flex-col gap-4 p-4 pr-4 sm:flex-row'>
        <div className='relative w-full'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari judul atau isi...'
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
      </div>

      {/* List Pengumuman */}
      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2'>
        {filteredPengumuman.length > 0 ? (
          filteredPengumuman.map((item, i) => (
            <Card key={i} className='shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <div dangerouslySetInnerHTML={{ __html: item?.content }}></div>
                <p className='text-xs font-medium text-black'>
                  Tanggal:{' '}
                  {new Date(item?.time).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada pengumuman ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
