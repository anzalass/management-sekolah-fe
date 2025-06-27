'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, ClipboardList, CalendarDays, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Materi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
  selesai: boolean;
}

interface Tugas {
  id: number;
  judul: string;
  deskripsi: string;
  deadline: string;
  selesai: boolean;
}

const dummyMateri: Materi[] = [
  {
    id: 1,
    judul: 'Pengantar Algoritma',
    konten: 'Pengenalan dasar algoritma dan struktur logika.',
    tanggal: '2025-06-15',
    selesai: true
  },
  {
    id: 2,
    judul: 'Struktur Data Dasar',
    konten: 'Pembahasan array, linked list, dan stack.',
    tanggal: '2025-06-18',
    selesai: false
  }
];

const dummyTugas: Tugas[] = [
  {
    id: 1,
    judul: 'Tugas Flowchart',
    deskripsi: 'Buatlah flowchart proses login aplikasi.',
    deadline: '2025-06-20',
    selesai: false
  },
  {
    id: 2,
    judul: 'Studi Kasus OOP',
    deskripsi: 'Buat aplikasi sederhana menggunakan konsep OOP.',
    deadline: '2025-06-23',
    selesai: true
  }
];

type DetailKelasId = {
  id: string;
};

export default function DetailKelasView({ id }: DetailKelasId) {
  const [tab, setTab] = useState('materi');

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Detail Kelas: XII IPA 1</h1>
          <p className='text-sm text-muted-foreground'>
            Materi dan Tugas yang tersedia di kelas ini.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className='mb-4'>
          <TabsTrigger value='materi'>Materi</TabsTrigger>
          <TabsTrigger value='tugas'>Tugas</TabsTrigger>
        </TabsList>

        {/* Materi */}
        <TabsContent value='materi'>
          <Card>
            <CardHeader className='flex items-center gap-2'>
              <BookOpenText className='h-5 w-5 text-blue-500' />
              <CardTitle>Materi Kelas</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {dummyMateri.map((materi) => (
                <div
                  key={materi.id}
                  className='rounded border p-3 transition hover:bg-muted'
                >
                  <div className='flex items-start justify-between'>
                    <div>
                      <h4 className='text-base font-semibold'>
                        {materi.judul}
                      </h4>
                      <p className='my-2 text-sm text-muted-foreground'>
                        {materi.konten}
                      </p>
                      <div className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                        <CalendarDays className='h-4 w-4' />
                        {materi.tanggal}
                      </div>
                    </div>
                    <Badge
                      className={
                        materi.selesai ? 'bg-green-500' : 'bg-yellow-400'
                      }
                    >
                      {materi.selesai ? 'Selesai' : 'Belum Selesai'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tugas */}
        <TabsContent value='tugas'>
          <Card>
            <CardHeader className='flex items-center gap-2'>
              <ClipboardList className='h-5 w-5 text-yellow-500' />
              <CardTitle>Tugas Kelas</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {dummyTugas.map((tugas) => (
                <div
                  key={tugas.id}
                  className='rounded border p-3 transition hover:bg-muted'
                >
                  <div className='flex items-start justify-between'>
                    <div>
                      <h4 className='text-base font-semibold'>{tugas.judul}</h4>
                      <p className='my-2 text-sm text-muted-foreground'>
                        {tugas.deskripsi}
                      </p>
                      <div className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                        <CalendarDays className='h-4 w-4' />
                        Deadline: {tugas.deadline}
                      </div>
                    </div>
                    <Badge
                      className={
                        tugas.selesai ? 'bg-green-500' : 'bg-yellow-400'
                      }
                    >
                      {tugas.selesai ? 'Selesai' : 'Belum Selesai'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
