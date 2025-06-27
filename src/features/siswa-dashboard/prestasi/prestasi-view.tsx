'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

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
  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div>
        <h1 className='text-2xl font-bold'>Riwayat Prestasi</h1>
        <p className='text-sm text-muted-foreground'>
          Daftar prestasi yang pernah diraih oleh siswa.
        </p>
      </div>

      <div className='space-y-4'>
        {prestasiDummy.map((item) => (
          <Card key={item.id} className='border shadow-sm'>
            <CardHeader className='flex justify-between'>
              <CardTitle className='flex gap-2 text-lg'>
                <Sparkles className='h-5 text-yellow-500' />
                {item.judul}
              </CardTitle>
              <span className='w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700'>
                {item.tanggal}
              </span>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              {item.deskripsi}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
