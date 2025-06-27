'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, LogIn, LogOut } from 'lucide-react';

interface Presensi {
  id: number;
  tanggal: string; // YYYY-MM-DD
  masuk: string | null;
  pulang: string | null;
}

const dummyPresensi: Presensi[] = [
  { id: 1, tanggal: '2025-06-19', masuk: '07:05', pulang: '14:00' },
  { id: 2, tanggal: '2025-06-18', masuk: '07:10', pulang: '13:55' },
  { id: 3, tanggal: '2025-06-17', masuk: '07:15', pulang: null },
  { id: 4, tanggal: '2025-06-16', masuk: null, pulang: null } // Tidak hadir
];

export default function LogPresensiView() {
  const [filterTanggal, setFilterTanggal] = useState('');

  const filtered = dummyPresensi.filter((item) =>
    filterTanggal ? item.tanggal === filterTanggal : true
  );

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div>
        <h1 className='text-2xl font-bold'>Log Presensi</h1>
        <p className='text-sm text-muted-foreground'>
          Riwayat absen masuk dan pulang siswa.
        </p>
      </div>

      {/* Filter Tanggal */}
      <div className='relative max-w-xs'>
        <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
        <Input
          type='date'
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Daftar Presensi */}
      <div className='space-y-4'>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <Card key={item.id} className='shadow-sm'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>
                  Tanggal: {item.tanggal}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p className='flex items-center gap-2'>
                  <LogIn className='h-4 w-4 text-green-500' />
                  Absen Masuk:{' '}
                  {item.masuk ? (
                    <span className='font-medium text-foreground'>
                      {item.masuk}
                    </span>
                  ) : (
                    <span className='text-red-500'>Tidak Hadir</span>
                  )}
                </p>
                <p className='flex items-center gap-2'>
                  <LogOut className='h-4 w-4 text-blue-500' />
                  Absen Pulang:{' '}
                  {item.pulang ? (
                    <span className='font-medium text-foreground'>
                      {item.pulang}
                    </span>
                  ) : item.masuk ? (
                    <span className='text-yellow-500'>Belum Absen Pulang</span>
                  ) : (
                    <span className='text-red-500'>Tidak Hadir</span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada data ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
