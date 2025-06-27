'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, SearchIcon } from 'lucide-react';

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
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  const filteredPengumuman = dummyPengumuman
    .filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => (filterTanggal ? item.tanggal === filterTanggal : true));

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div>
        <h1 className='text-2xl font-bold'>Pengumuman</h1>
        <p className='text-sm text-muted-foreground'>
          Daftar informasi atau pengumuman penting dari sekolah.
        </p>
      </div>

      {/* Filter */}
      <div className='flex flex-col gap-4 sm:flex-row'>
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
      <div className='space-y-4'>
        {filteredPengumuman.length > 0 ? (
          filteredPengumuman.map((item) => (
            <Card key={item.id} className='shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>{item.content}</p>
                <p className='text-xs font-medium text-primary'>
                  Tanggal: {item.tanggal}
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
