'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';

type Tagihan = {
  id: string;
  nama: string;
  nominal: number;
  jatuhTempo: string;
  status: string;
  tanggalBayar?: string;
};

type Riwayat = {
  id: string;
  nama: string;
  nominal: number;
  tanggalBayar: string;
  metode: string;
};

export default function PembayaranSiswaView() {
  const { data: session } = useSession();
  const [searchTagihan, setSearchTagihan] = useState('');
  const [tanggalTagihan, setTanggalTagihan] = useState('');
  const [searchRiwayat, setSearchRiwayat] = useState('');
  const [tanggalRiwayat, setTanggalRiwayat] = useState('');

  // Fetch pembayaran siswa pakai React Query
  const { data: pembayaranData, isLoading } = useQuery({
    queryKey: ['pembayaranSiswa'],
    queryFn: async () => {
      const res = await api.get('/pembayaran-siswa', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      const data = res?.data?.data;

      return {
        tagihan:
          data?.tagihan?.map((t: any) => ({
            id: t.id,
            nama: t.nama,
            nominal: t.nominal,
            jatuhTempo: new Date(t.jatuhTempo).toISOString().split('T')[0],
            status: t.status,
            tanggalBayar: t.RiwayatPembayaran?.[0]?.waktuBayar
              ? new Date(t.RiwayatPembayaran[0].waktuBayar)
                  .toISOString()
                  .split('T')[0]
              : undefined
          })) || [],
        riwayat:
          data?.riwayatPembayaran?.map((r: any) => ({
            id: r.id,
            nama: r.namaTagihan || '-',
            nominal: r?.nominal || 0,
            tanggalBayar: new Date(r.waktuBayar).toISOString().split('T')[0],
            metode: r.metodeBayar
          })) || []
      };
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 5 // cache 5 menit
  });

  // Filter data
  const filteredTagihan = pembayaranData?.tagihan?.filter(
    (t: any) =>
      t.nama.toLowerCase().includes(searchTagihan.toLowerCase()) &&
      (tanggalTagihan ? t.jatuhTempo === tanggalTagihan : true)
  );

  const filteredRiwayat = pembayaranData?.riwayat?.filter(
    (r: any) =>
      r.nama.toLowerCase().includes(searchRiwayat.toLowerCase()) &&
      (tanggalRiwayat ? r.tanggalBayar === tanggalRiwayat : true)
  );

  return (
    <div className='mx-auto mb-14 w-full space-y-6'>
      <NavbarSiswa title='Pembayaran' />

      <Tabs defaultValue='tagihan' className='mx-auto w-[100%] space-y-2'>
        <TabsList className='ml-5 grid w-11/12 grid-cols-2 md:w-72'>
          <TabsTrigger value='tagihan'>Tagihan</TabsTrigger>
          <TabsTrigger value='riwayat'>Riwayat Pembayaran</TabsTrigger>
        </TabsList>

        {/* Tagihan */}
        <TabsContent value='tagihan' className=''>
          <div>
            <CardHeader className='space-y-3'>
              <div className='mt-3 flex w-full justify-between gap-2 sm:flex-row md:w-1/2'>
                <input
                  type='text'
                  placeholder='Cari tagihan...'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-1/2'
                  value={searchTagihan}
                  onChange={(e) => setSearchTagihan(e.target.value)}
                />
                <input
                  type='date'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-1/2'
                  value={tanggalTagihan}
                  onChange={(e) => setTanggalTagihan(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className='text-sm text-muted-foreground'>Loading...</p>
              ) : (
                <div className='space-y-4'>
                  {filteredTagihan?.length === 0 && (
                    <p className='text-sm text-muted-foreground'>
                      Tidak ada tagihan.
                    </p>
                  )}
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {filteredTagihan?.map((tagihan: any) => (
                      <Card
                        key={tagihan.id}
                        className='flex flex-col justify-between p-4'
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
                          {tagihan.status === 'dibayar' &&
                            tagihan.tanggalBayar && (
                              <p className='text-sm text-green-600'>
                                Dibayar: {tagihan.tanggalBayar}
                              </p>
                            )}
                        </div>
                        <div className='mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between'>
                          {tagihan.status === 'belum' ? (
                            <>
                              <Badge variant='destructive'>Belum Dibayar</Badge>
                              <Button size='sm'>Bayar Sekarang</Button>
                            </>
                          ) : (
                            <Badge variant='default'>Sudah Dibayar</Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </TabsContent>

        {/* Riwayat */}
        <TabsContent value='riwayat'>
          <div>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
              <div className='mt-3 flex w-full flex-col justify-between gap-2 sm:flex-row md:w-1/2'>
                <input
                  type='text'
                  placeholder='Cari riwayat...'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-1/2'
                  value={searchRiwayat}
                  onChange={(e) => setSearchRiwayat(e.target.value)}
                />
                <input
                  type='date'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-1/2'
                  value={tanggalRiwayat}
                  onChange={(e) => setTanggalRiwayat(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className='text-sm text-muted-foreground'>Loading...</p>
              ) : (
                <>
                  {filteredRiwayat?.length === 0 && (
                    <p className='text-sm text-muted-foreground'>
                      Belum ada riwayat pembayaran.
                    </p>
                  )}
                  <div className='space-y-3'>
                    {filteredRiwayat?.map((r: any) => (
                      <Card
                        key={r.id}
                        className='flex items-center justify-between p-4'
                      >
                        <div>
                          <h3 className='text-base font-semibold'>{r.nama}</h3>
                          <p className='text-sm text-muted-foreground'>
                            Nominal: Rp{r.nominal.toLocaleString()}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Dibayar: {r.tanggalBayar} ({r.metode})
                          </p>
                        </div>
                        <Badge className='bg-green-600 text-white'>Lunas</Badge>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </div>
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
}
