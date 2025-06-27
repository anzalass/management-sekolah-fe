'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarClock, RefreshCcw, Wallet } from 'lucide-react';
import { useState } from 'react';

type Tagihan = {
  id: number;
  nama: string;
  nominal: number;
  jatuhTempo: string;
  status: 'dibayar' | 'belum';
  tanggalBayar?: string;
};

export default function PembayaranSiswaView() {
  const [filter, setFilter] = useState<'all' | 'belum' | 'dibayar'>('all');

  const semuaTagihan: Tagihan[] = [
    {
      id: 1,
      nama: 'SPP Bulan Juni',
      nominal: 250000,
      jatuhTempo: '2025-06-10',
      status: 'belum'
    },
    {
      id: 2,
      nama: 'Uang Kegiatan Semester',
      nominal: 150000,
      jatuhTempo: '2025-05-15',
      status: 'dibayar',
      tanggalBayar: '2025-05-10'
    },
    {
      id: 3,
      nama: 'SPP Bulan Mei',
      nominal: 250000,
      jatuhTempo: '2025-05-10',
      status: 'dibayar',
      tanggalBayar: '2025-05-08'
    },
    {
      id: 4,
      nama: 'SPP Bulan Juni',
      nominal: 250000,
      jatuhTempo: '2025-06-10',
      status: 'belum'
    },
    {
      id: 5,
      nama: 'Uang Kegiatan Semester',
      nominal: 150000,
      jatuhTempo: '2025-05-15',
      status: 'dibayar',
      tanggalBayar: '2025-05-10'
    },
    {
      id: 6,
      nama: 'SPP Bulan Mei',
      nominal: 250000,
      jatuhTempo: '2025-05-10',
      status: 'dibayar',
      tanggalBayar: '2025-05-08'
    }
  ];

  const filtered = semuaTagihan.filter((t) =>
    filter === 'all' ? true : t.status === filter
  );

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Wallet className='h-5 w-5 text-primary' />
              Pembayaran Siswa
            </CardTitle>
            <Button
              onClick={() => window.location.reload()} // atau fungsi fetch data
              className='text-sm hover:underline'
            >
              <RefreshCcw size={14} className='mr-3' /> Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={filter} onValueChange={(val) => setFilter(val as any)}>
            <TabsList className='mb-4'>
              <TabsTrigger value='all'>Semua</TabsTrigger>
              <TabsTrigger value='belum'>Belum Dibayar</TabsTrigger>
              <TabsTrigger value='dibayar'>Sudah Dibayar</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              <div className='space-y-4'>
                {filtered.length === 0 && (
                  <p className='text-sm text-muted-foreground'>
                    Tidak ada tagihan.
                  </p>
                )}

                {filtered.map((tagihan) => (
                  <Card
                    key={tagihan.id}
                    className='flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center'
                  >
                    <div>
                      <h3 className='text-base font-semibold'>
                        {tagihan.nama}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Nominal:{' '}
                        <span className='font-medium text-black'>
                          Rp{tagihan.nominal.toLocaleString()}
                        </span>
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Jatuh Tempo: {tagihan.jatuhTempo}
                      </p>
                      {tagihan.status === 'dibayar' && tagihan.tanggalBayar && (
                        <p className='text-sm text-green-600'>
                          Dibayar: {tagihan.tanggalBayar}
                        </p>
                      )}
                    </div>

                    <div className='flex flex-col items-end gap-2 sm:items-center'>
                      {tagihan.status === 'belum' ? (
                        <Badge variant='destructive'>Belum Dibayar</Badge>
                      ) : (
                        <Badge variant='default'>Sudah Dibayar</Badge>
                      )}

                      {tagihan.status === 'belum' && (
                        <Button size='sm' className='mt-1'>
                          Bayar Sekarang
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
