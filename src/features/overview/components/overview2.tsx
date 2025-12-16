'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import {
  Boxes,
  CheckCircle,
  Clock,
  DoorOpen,
  FileText,
  LucideIcon,
  School,
  User,
  Users,
  X,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 🧠 Fungsi fetch data pakai API client
const fetchDashboard = async (token: string) => {
  const res = await api.get('dashboard-overview', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export default function Overview2() {
  const { data: session } = useSession();
  const token = session?.user?.token || '';

  // 🧩 React Query untuk ambil data dashboard
  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboard-overview', token],
    queryFn: () => fetchDashboard(token),
    enabled: !!token // hanya fetch kalau token tersedia
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className='py-10 text-center text-muted-foreground'>
          Loading dashboard...
        </div>
      </PageContainer>
    );
  }

  if (isError || !dashboard) {
    return (
      <PageContainer>
        <div className='py-10 text-center text-red-500'>
          Gagal memuat dashboard.
          <Button className='ml-2' onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-5'>
        <div className='my-5 flex flex-col items-center justify-between space-y-2 md:flex-row'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back {session?.user?.nama} 👋
          </h2>
          <div className='flex space-x-3'>
            <Link href={'/mengajar'}>
              <Button className='text-xs md:text-sm'>
                Dashboard Mengajar {session?.user?.nama}
              </Button>
            </Link>
          </div>
        </div>

        {/* 🔹 Card Summary */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
          <DashboardCard
            title='Anggaran Sekolah'
            value={
              dashboard?.kasSekolah?.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }) || 'Rp 0'
            }
            icon={School}
          />
          <DashboardCard
            title='Siswa Laki Laki'
            value={dashboard?.jumlahSiswa?.lakiLaki || 0}
            icon={User}
          />
          <DashboardCard
            title='Siswa Perempuan'
            value={dashboard?.jumlahSiswa?.perempuan || 0}
            icon={User}
          />
          <DashboardCard
            title='Guru dan Staff'
            value={dashboard?.totalGuru || 0}
            icon={Users}
          />
          <DashboardCard
            icon={DoorOpen}
            title='Ruangan'
            value={dashboard?.totalRuangan || 0}
          />
          <DashboardCard
            icon={Boxes}
            title='Inventaris'
            value={dashboard?.totalInventaris || 0}
          />
          <DashboardCard
            icon={Boxes}
            title='Kelas'
            value={dashboard?.totalInventaris || 0}
          />
          <DashboardCard
            icon={Boxes}
            title='Pendaftar Bulan Ini'
            value={dashboard?.pendaftarBulanIni || 0}
          />
          <DashboardCard
            icon={Boxes}
            title='Total Tagihan'
            value={dashboard?.totalTagihan || 0}
          />
          <DashboardCard
            icon={Boxes}
            title='Tagihan Belum Terbayar'
            value={dashboard?.totalInventaris || 0}
          />
          <DashboardCard
            icon={Boxes}
            title='Nominal Tagihan Belum Terbayar'
            value={
              dashboard?.totalNominalBelumBayar.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }) ||
              'Rp 0' ||
              0
            }
          />
          <DashboardCard
            icon={Boxes}
            title='Tagihan Menunggu Konfirmasi'
            value={dashboard?.totalTagihanMenungguKonfirmasi || 0}
          />
        </div>

        {/* 🔹 Data Pegawai dan Izin */}
        <div className='mt-8 flex flex-col justify-between gap-3 md:flex-row'>
          <div className='w-full sm:w-1/2'>
            <Card className='p-4'>
              <p className='mb-4 text-base font-bold'>
                Pegawai dengan absensi tercepat
              </p>
              <ul className='mt-8 space-y-3'>
                {dashboard.guruMasukPalingPagi?.length > 0 ? (
                  dashboard.guruMasukPalingPagi
                    .slice(0, 3)
                    .map((item: any, idx: number) => (
                      <li key={idx} className='flex items-center space-x-3'>
                        <img
                          src={
                            item?.Guru?.foto ||
                            'https://res.cloudinary.com/dyofh7ecq/image/upload/v1741067315/samples/landscapes/beach-boat.jpg'
                          }
                          alt={item.Guru.nama}
                          className='h-10 w-10 rounded-full object-cover ring-2 ring-primary'
                        />
                        <div className='flex w-full justify-between'>
                          <p className='text-base font-semibold'>
                            {item.Guru.nama}
                          </p>
                          <p className='flex gap-3 text-base text-muted-foreground'>
                            <Clock size={20} />
                            <span className='-mt-1'>
                              {new Date(item.jamMasuk).toLocaleTimeString(
                                'id-ID',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }
                              )}
                            </span>
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

          <IzinGuruHariIni dashboard={dashboard?.izinGuruHariIni} />
        </div>

        <div className='mt-8 flex flex-col justify-between gap-3 md:flex-row'>
          <PendaftarHariIniTable data={dashboard.pendaftarHariIni} />
          <RiwayatAnggaranTable data={dashboard.riwayatAnggaranHariIni} />
        </div>
      </div>
    </PageContainer>
  );
}

// 🧩 Komponen Card Ringkas
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
    <div className='rounded-lg border-2 bg-[#fdf9f7] p-2.5'>
      <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-5 w-5 text-muted-foreground' />
      </div>
      <div>
        <div className='text-[18px] font-bold'>{value}</div>
      </div>
    </div>
  );
}

function IzinGuruHariIni({ dashboard }: any) {
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { toggleTrigger } = useRenderTrigger(); // pindahkan ke sini

  const openModal = (url: any) => {
    if (url) setModalImage(url);
  };

  const closeModal = () => setModalImage(null);

  // Normalisasi status: pastikan case-nya konsisten
  const normalizeStatus = (status: any) => {
    return (status || 'menunggu').toLowerCase();
  };

  const queryClient = useQueryClient();

  const handleApprove = async (id: any) => {
    setLoading(true);
    try {
      await api.put(
        `perizinan-guru/acc/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      // 🔁 Trigger refetch dashboard
      queryClient.invalidateQueries({
        queryKey: ['dashboard-overview', session?.user?.token]
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Terjadi Kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: any) => {
    setLoading(true);
    try {
      await api.put(
        `perizinan-guru/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      // 🔁 Trigger refetch dashboard
      queryClient.invalidateQueries({
        queryKey: ['dashboard-overview', session?.user?.token]
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className='w-full sm:w-1/2'>
        <Card className='p-4'>
          <p className='mb-4 text-base font-bold'>Perizinan hari ini</p>

          {dashboard?.length > 0 ? (
            <div className='divide-y'>
              {dashboard.map((item: any, idx: any) => {
                const status = normalizeStatus(item?.status);
                const hasBukti = !!item?.bukti;

                return (
                  <div
                    key={idx}
                    className='flex items-start justify-between gap-3 py-3'
                  >
                    {/* Kolom Guru */}
                    <div className='flex min-w-0 items-center gap-3'>
                      {(() => {
                        const guru = item?.Guru;
                        const hasFoto = guru?.foto && guru.foto.trim() !== '';
                        const initial = guru?.nama
                          ? guru.nama.charAt(0).toUpperCase()
                          : '?';

                        return hasFoto ? (
                          <img
                            src={guru.foto}
                            alt={guru.nama || 'Guru'}
                            className='h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-yellow-400'
                          />
                        ) : (
                          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ring-2 ring-yellow-400'>
                            {initial}
                          </div>
                        );
                      })()}
                      <div className='truncate'>
                        <p className='text-sm font-semibold'>
                          {item?.Guru?.nama}
                        </p>
                        <p className='truncate text-xs text-muted-foreground'>
                          {item?.keterangan}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className='text-right'>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          status === 'disetujui'
                            ? 'bg-green-100 text-green-800'
                            : status === 'ditolak'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    {/* Aksi */}
                    <div className='flex items-center gap-2'>
                      {/* Tombol lihat bukti */}
                      {hasBukti && (
                        <button
                          onClick={() => openModal(item.bukti)}
                          className='text-muted-foreground hover:text-primary'
                          aria-label='Lihat bukti izin'
                        >
                          <FileText size={18} />
                        </button>
                      )}

                      {/* Tombol Setuju / Tolak */}
                      {status === 'menunggu' && (
                        <>
                          <button
                            onClick={() => handleApprove(item?.id)}
                            className='rounded-full p-1.5 text-green-600 hover:bg-green-100'
                            aria-label='Setujui'
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(item?.id)}
                            className='rounded-full p-1.5 text-red-600 hover:bg-red-100'
                            aria-label='Tolak'
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>Tidak ada guru izin</p>
          )}
        </Card>
      </div>

      {/* === MODAL FOTO BUKTI === */}
      {modalImage && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'
          onClick={closeModal}
        >
          <div
            className='relative max-h-full max-w-3xl'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className='absolute -top-10 right-0 rounded-full bg-black/50 p-1 text-white'
              aria-label='Tutup'
            >
              <X size={24} />
            </button>
            <img
              src={modalImage}
              alt='Bukti izin'
              className='max-h-[80vh] w-auto max-w-full rounded-lg bg-white object-contain p-2'
            />
          </div>
        </div>
      )}
    </>
  );
}

import { MessageCircle } from 'lucide-react';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

// --- TABEL 1: Riwayat Anggaran ---
const RiwayatAnggaranTable = ({ data = [] }) => {
  return (
    <Card className='w-[100%] overflow-x-auto md:w-1/2'>
      <div className='w-[110%] rounded-lg border p-4 shadow-sm md:w-full'>
        <h3 className='mb-4 text-lg font-bold'>Riwayat Anggaran</h3>
        {data.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b text-muted-foreground'>
                  <th className='px-3 py-2 text-left'>Nama</th>
                  <th className='px-3 py-2 text-right'>Jumlah</th>
                  <th className='px-3 py-2 text-left'>Jenis</th>
                  <th className='px-3 py-2 text-left'>Tanggal</th>
                  <th className='px-3 py-2 text-left'>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id} className='border-b hover:bg-accent/30'>
                    <td className='px-3 py-3 font-medium'>{item.nama}</td>
                    <td className='px-3 py-3 text-right font-mono'>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(item.jumlah)}
                    </td>
                    <td className='px-3 py-3'>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          item.jenis === 'Pemasukan'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.jenis}
                      </span>
                    </td>
                    <td className='px-3 py-3'>
                      {new Date(item.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className='max-w-xs truncate px-3 py-3 text-muted-foreground'>
                      {item.keterangan || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            Belum ada data anggaran
          </p>
        )}
      </div>
    </Card>
  );
};

// --- TABEL 2: Pendaftar Hari Ini ---
const PendaftarHariIniTable = ({ data = [] }) => {
  const handleChat = (pendaftar: any) => {
    // Buka WhatsApp atau chat system
    console.log('Chat dengan:', pendaftar);
    window.location.href = `https://wa.me/${pendaftar.phoneNumber}`;
  };

  return (
    <Card className='w-[100%] overflow-x-auto md:w-1/2'>
      <div className='w-[110%] rounded-lg border p-4 shadow-sm md:w-full'>
        <h3 className='mb-4 text-lg font-bold'>Pendaftar Hari Ini</h3>
        {data.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b text-muted-foreground'>
                  <th className='px-3 py-2 text-left'>Student Name</th>
                  <th className='px-3 py-2 text-left'>Parent Name</th>
                  <th className='px-3 py-2 text-left'>Email</th>
                  <th className='px-3 py-2 text-left'>Phone</th>
                  <th className='px-3 py-2 text-left'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id} className='border-b hover:bg-accent/30'>
                    <td className='px-3 py-3 font-medium'>
                      {item.studentName}
                    </td>
                    <td className='px-3 py-3'>{item.parentName}</td>
                    <td className='px-3 py-3 text-muted-foreground'>
                      <a
                        href={`mailto:${item.email}`}
                        className='hover:underline'
                      >
                        {item.email}
                      </a>
                    </td>
                    <td className='px-3 py-3 font-mono'>{item.phoneNumber}</td>
                    <td className='px-3 py-3'>
                      <button
                        onClick={() => handleChat(item)}
                        className='rounded-full p-2 text-primary transition-colors hover:bg-primary/10'
                        aria-label={`Chat dengan ${item.parentName}`}
                      >
                        <MessageCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            Belum ada pendaftar hari ini
          </p>
        )}
      </div>
    </Card>
  );
};

// --- Export ---
