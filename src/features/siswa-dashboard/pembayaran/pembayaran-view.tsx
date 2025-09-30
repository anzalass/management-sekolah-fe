'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import FilterMobile from './filter-pembayaran-mobile';
import EmptyState from '../empty-state';
import Loading from '../loading';
import { useRouter } from 'next/navigation';
import { DollarSign, DollarSignIcon } from 'lucide-react';

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tagihan' | 'riwayat'>('tagihan');

  const BayarMidtrans = async (tagihan: any) => {
    try {
      const data = await api.post(`bayar-midtrans/${tagihan.id}`);
      if (data.status === 200) {
        router.push(data.data.snap.redirect_url);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // filter state
  const [searchTagihan, setSearchTagihan] = useState('');
  const [tanggalTagihan, setTanggalTagihan] = useState('');
  const [searchRiwayat, setSearchRiwayat] = useState('');
  const [tanggalRiwayat, setTanggalRiwayat] = useState('');

  // Fetch pembayaran siswa
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
            metode: r.metodeBayar,
            status: r.status
          })) || []
      };
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 5
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
    <div className='mx-auto mb-36 w-full space-y-2'>
      <NavbarSiswa title='Pembayaran' />

      {/* Tombol Toggle Tab */}
      <div className='mx-auto ml-0 flex w-full gap-2 p-4 sm:w-[80%] md:w-[50%]'>
        <Button
          onClick={() => setActiveTab('tagihan')}
          className={`flex-1 ${
            activeTab === 'tagihan'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border border-blue-600 bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          Tagihan
        </Button>
        <Button
          onClick={() => setActiveTab('riwayat')}
          className={`flex-1 ${
            activeTab === 'riwayat'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border border-blue-600 bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          Riwayat Pembayaran
        </Button>
      </div>

      {/* Konten */}
      {activeTab === 'tagihan' && (
        <div>
          <div className=''>
            <div className='mt-3 hidden w-full justify-between gap-2 px-5 sm:flex md:w-1/2'>
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
                placeholder='Tanggal'
                onChange={(e) => setTanggalTagihan(e.target.value)}
              />
            </div>
            <FilterMobile
              searchValue={searchTagihan}
              setSearchValue={setSearchTagihan}
              tanggalValue={tanggalTagihan}
              setTanggalValue={setTanggalTagihan}
            />
          </div>
          <div className='px-5 md:mt-5'>
            {isLoading ? (
              <Loading />
            ) : (
              <div className='space-y-4'>
                {filteredTagihan?.length === 0 && <EmptyState />}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredTagihan?.map((tagihan: any) => (
                    <Card
                      key={tagihan.id}
                      className='group flex cursor-pointer flex-col justify-between rounded-2xl border border-gray-200 p-5 shadow-sm transition hover:shadow-md'
                    >
                      <div className='space-y-2'>
                        {/* Nama Tagihan */}
                        <h3 className='text-base font-semibold text-gray-900 group-hover:text-blue-600 md:text-lg'>
                          {tagihan.nama}
                        </h3>

                        {/* Nominal */}
                        <p className='text-sm text-gray-600'>
                          <span className='font-medium text-gray-900'>
                            Rp
                            {tagihan.nominal.toLocaleString('id-ID')}
                          </span>
                        </p>

                        {/* Jatuh Tempo */}
                        <p className='text-sm text-gray-600'>
                          Jatuh Tempo:{' '}
                          <span className='font-medium text-gray-900'>
                            {new Date(tagihan.jatuhTempo).toLocaleDateString(
                              'id-ID',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              }
                            )}
                          </span>
                        </p>

                        {/* Tanggal Bayar (jika dibayar) */}
                        {tagihan.status === 'LUNAS' && tagihan.tanggalBayar && (
                          <p className='text-sm text-green-600'>
                            Dibayar:{' '}
                            {new Date(tagihan.tanggalBayar).toLocaleDateString(
                              'id-ID',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              }
                            )}
                          </p>
                        )}
                      </div>

                      {/* Status & Action */}
                      <div className='mt-4 flex items-start gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        {tagihan.status === 'BELUM_BAYAR' ? (
                          <>
                            <Badge variant='destructive' className='px-3 py-1'>
                              Belum Dibayar
                            </Badge>
                            <Button
                              onClick={() => BayarMidtrans(tagihan)}
                              size='sm'
                              className='bg-blue-600 text-white hover:bg-blue-700'
                            >
                              Bayar Sekarang
                            </Button>
                          </>
                        ) : (
                          <Badge
                            className={`px-3 py-1 text-sm ${tagihan.status === 'LUNAS' ? 'bg-green-300 text-green-700' : tagihan.status === 'PENDING' ? 'bg-yellow-300 text-yellow-700' : 'bg-red-300 text-red-700'} `}
                          >
                            {tagihan.status}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div>
          <div>
            <div className='mt-3 hidden w-full justify-between gap-2 px-5 pb-4 sm:flex md:w-1/2'>
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
            <FilterMobile
              searchValue={searchRiwayat}
              setSearchValue={setSearchRiwayat}
              tanggalValue={tanggalRiwayat}
              setTanggalValue={setTanggalRiwayat}
            />
          </div>
          <div className='px-5'>
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
                      <Badge
                        className={`px-3 py-1 text-sm ${r.status === 'LUNAS' ? 'bg-green-300 text-green-700' : r.status === 'PENDING' ? 'bg-yellow-300 text-yellow-700' : 'bg-red-300 text-red-700'} `}
                      >
                        {r.status}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
