'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import { Boxes, DoorOpen, LucideIcon, School, User, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Overview2() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [data2, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}dashboard-overview`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }); // sesuaikan endpoint-mu
        setData(res.data.data);
      } catch (error) {
        toast.error('Failed to fetch dashboard');
      }
    };

    fetchDashboard();
  }, [session?.user?.token]);

  if (!data2) {
    return (
      <PageContainer>
        <div className='py-10 text-center text-muted-foreground'>
          Loading dashboard...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-5'>
        <div className='my-5 flex flex-col items-center justify-between space-y-2 md:flex-row'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
          <div className='flex space-x-3'>
            <Link href={'/dashboard/mengajar'}>
              <Button className='text-xs md:text-sm'>Dashboard Mengajar</Button>
            </Link>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <DashboardCard
            title='Anggaran Sekolah'
            value={
              data2.kasSekolah?.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }) || 'Rp 0'
            }
            icon={School}
          />
          <DashboardCard
            title='Siswa Laki Laki'
            value={data2.jumlahSiswa?.lakiLaki || 0}
            icon={User}
          />
          <DashboardCard
            title='Siswa Perempuan'
            value={data2.jumlahSiswa?.perempuan || 0}
            icon={User}
          />
          <DashboardCard
            title='Guru dan Staff'
            value={data2.totalGuru || 0}
            icon={Users}
          />
        </div>
        <div className='mt-3 grid gap-5 md:grid-cols-2'>
          <DashboardCard
            icon={DoorOpen}
            title='Ruangan'
            value={data2.totalRuangan || 0}
          />
          <DashboardCard
            icon={Boxes}
            title='Inventaris'
            value={data2.totalInventaris || 0}
          />
        </div>

        <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <Card className='p-4'>
              <p className='mb-4 text-base font-bold'>
                Pegawai dengan absensi tercepat
              </p>
              <ul className='space-y-3'>
                {data2.guruMasukPalingPagi?.length > 0 ? (
                  data2.guruMasukPalingPagi
                    .slice(0, 3)
                    .map((item: any, idx: number) => (
                      <li key={idx} className='flex items-center space-x-3'>
                        <img
                          src={item?.Guru?.foto}
                          alt={item.Guru.nama}
                          className='h-10 w-10 rounded-full object-cover ring-2 ring-primary'
                        />
                        <div>
                          <p className='text-lg font-semibold'>
                            {item.Guru.nama}
                          </p>
                          <p className='text-base text-muted-foreground'>
                            Jam Masuk:{' '}
                            {new Date(item.jamMasuk).toLocaleTimeString(
                              'id-ID',
                              {
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )}
                          </p>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className='text-sm text-muted-foreground'>
                    Belum ada data hari ini
                  </li>
                )}
              </ul>
            </Card>
          </div>

          <div className='col-span-4 md:col-span-3'>
            <Card className='p-4'>
              <p className='mb-4 text-base font-bold'>Perizinan hari ini</p>
              <ul className='space-y-3'>
                {data2.izinGuruHariIni?.length > 0 ? (
                  data2.izinGuruHariIni.map((item: any, idx: number) => (
                    <li key={idx} className='flex items-center space-x-3'>
                      <img
                        src={item?.Guru?.foto || '/default-profile.png'}
                        alt={item?.Guru?.nama}
                        className='h-10 w-10 rounded-full object-cover ring-2 ring-yellow-400'
                      />
                      <div>
                        <p className='text-lg font-semibold'>
                          {item?.Guru?.nama}
                        </p>
                        <p className='text-base text-muted-foreground'>
                          {item?.keterangan} ({item.status})
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className='text-sm text-muted-foreground'>
                    Tidak ada guru izin
                  </li>
                )}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// Komponen Card Ringkas

function DashboardCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-5 w-5 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>Terupdate</p>
      </CardContent>
    </Card>
  );
}
