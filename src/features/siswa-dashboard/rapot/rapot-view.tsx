'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarIcon, FileTextIcon } from 'lucide-react';

interface Rapot {
  id: number;
  tahunAjaran: string;
  semester: string;
  status: 'Tersedia' | 'Belum Tersedia';
}

const dummyRapot: Rapot[] = [
  {
    id: 1,
    tahunAjaran: '2022/2023',
    semester: 'Ganjil',
    status: 'Tersedia'
  },
  {
    id: 2,
    tahunAjaran: '2022/2023',
    semester: 'Genap',
    status: 'Tersedia'
  },
  {
    id: 3,
    tahunAjaran: '2023/2024',
    semester: 'Ganjil',
    status: 'Tersedia'
  },
  {
    id: 4,
    tahunAjaran: '2023/2024',
    semester: 'Genap',
    status: 'Belum Tersedia'
  }
];

export default function RapotView() {
  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div>
        <h1 className='text-2xl font-bold'>Daftar Rapot</h1>
        <p className='text-sm text-muted-foreground'>
          Lihat daftar rapot berdasarkan tahun ajaran dan semester.
        </p>
      </div>

      <div className='space-y-4'>
        {dummyRapot.map((rapot) => (
          <Card
            key={rapot.id}
            className='flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center'
          >
            <div className='space-y-1'>
              <CardTitle className='text-base font-semibold'>
                {rapot.semester} - Tahun Ajaran {rapot.tahunAjaran}
              </CardTitle>
              <p className='flex items-center text-sm text-muted-foreground'>
                <CalendarIcon className='mr-1 h-4 w-4' />
                {rapot.status}
              </p>
            </div>

            <div>
              {rapot.status === 'Tersedia' ? (
                <button className='flex items-center gap-1 text-sm font-medium text-primary hover:underline'>
                  <FileTextIcon className='h-4 w-4' />
                  Lihat Rapot
                </button>
              ) : (
                <span className='text-sm italic text-red-500'>
                  Belum tersedia
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
