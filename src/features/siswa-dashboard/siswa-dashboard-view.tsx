'use client';

import { useState, useEffect } from 'react';
import {
  LogOut,
  Info,
  CalendarClock,
  CalendarIcon,
  UsersIcon,
  Lock,
  Loader
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import MenuFiturSiswa from './menu-siswa';
import BottomNav from './bottom-nav';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import EmptyState from './empty-state';
import Loading from './loading';

export interface Kelas {
  id: string;
  banner: string;
  namaMapel: string;
  namaGuru: string;
  totalSiswa: number;
  nama: string;
  waliKelas: string;
  tahunAjaran: string;
  jumlahSiswa: number;
  imageUrl: string;
}

interface JadwalPelajaran {
  id: string;
  idKelas: string;
  hari: string;
  namaMapel: string;
  jamMulai: string;
  jamSelesai: string;
}

interface Pengumuman {
  id: string;
  title: string;
  time: string;
  content: string;
}

interface SiswaData {
  kelasAktif: Kelas[];
  jadwalPelajaran: JadwalPelajaran[];
  berandaInformasi: Pengumuman[];
}

export default function SiswaHomeView() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] =
    useState<Pengumuman | null>(null);

  const fetchSiswaData = async (): Promise<SiswaData> => {
    if (!session?.user?.token)
      return { kelasAktif: [], jadwalPelajaran: [], berandaInformasi: [] };

    const res = await api.get('siswa', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.token}`
      }
    });

    return res.data.result as SiswaData;
  };

  const { data, error, isLoading } = useQuery<SiswaData, unknown>({
    queryKey: ['siswa-data'],
    queryFn: fetchSiswaData,
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 20
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memuat data'
      );
    }
  }, [error]);

  const kelas: Kelas[] = data?.kelasAktif ?? [];
  const jadwalPelajaran: JadwalPelajaran[] = data?.jadwalPelajaran ?? [];
  const pengumuman: Pengumuman[] = data?.berandaInformasi ?? [];

  const getInitials = (nama?: string) => {
    if (!nama) return '';
    const parts = nama.trim().split(' ');
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
  };
  const initials = getInitials(session?.user?.nama);
  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&format=png`;

  const handleLogout = async () =>
    await signOut({ callbackUrl: '/login-siswa' });
  const handleChangePassword = () => router.push('/siswa/ubah-password');

  const openModal = (info: Pengumuman) => {
    setSelectedPengumuman(info);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <p className='p-4 text-center text-sm text-red-500'>Gagal memuat data</p>
    );

  return (
    <div className='mx-auto mb-14'>
      {/* Profil Siswa */}
      <div className='relative bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-base font-bold md:text-2xl'>
              Hi, {session?.user?.nama}
            </h2>
            <p className='text-xs opacity-90'>{session?.user?.nip}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='relative h-10 w-10 overflow-hidden rounded-full border-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 md:h-12 md:w-12'>
                <Image
                  src={session?.user?.foto || avatarUrl}
                  alt='Foto Siswa'
                  width={100}
                  height={100}
                  className='h-full w-full object-cover'
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem onClick={handleChangePassword}>
                <Lock className='mr-2 h-4 w-4 text-blue-500' /> Ubah Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className='mr-2 h-4 w-4 text-red-500' /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='absolute -z-10 h-[50vh] w-full rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 shadow-md'></div>

      <MenuFiturSiswa />

      <div className='mt-8 space-y-8 px-4 md:px-8'>
        {/* Daftar Kelas */}
        <Card className='border border-gray-200 p-5 shadow-md transition hover:shadow-lg'>
          <div className='pb-3 pt-2'>
            <CardTitle className='text-base md:text-lg'>
              Daftar Kelas Aktif
            </CardTitle>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {kelas.length > 0 ? (
              kelas.map((kelasItem) => (
                <Link href={`/siswa/kelas/${kelasItem.id}`} key={kelasItem.id}>
                  <Card className='cursor-pointer overflow-hidden rounded-xl shadow transition hover:shadow-lg'>
                    <img
                      src={kelasItem.banner || '/banner-default.jpg'}
                      alt={kelasItem.nama}
                      className='h-32 w-full object-cover'
                    />
                    <CardHeader>
                      <CardTitle className='text-base font-semibold md:text-lg'>
                        {kelasItem.namaMapel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-xs text-muted-foreground md:text-sm'>
                      <p>Pengajar: {kelasItem.namaGuru}</p>
                      <p className='flex items-center gap-1'>
                        <CalendarIcon className='h-4 w-4 text-blue-500' />{' '}
                        {kelasItem.tahunAjaran}
                      </p>
                      <p className='flex items-center gap-1'>
                        <UsersIcon className='h-4 w-4 text-green-500' />{' '}
                        {kelasItem.totalSiswa} siswa
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Tidak ada kelas ditemukan.
              </p>
            )}
          </div>
        </Card>

        {/* Jadwal Pelajaran */}
        <Card className='border border-gray-200 shadow-md transition hover:shadow-lg'>
          <CardHeader className='flex items-center gap-2'>
            <CalendarClock className='h-5 w-5 text-primary' />
            <CardTitle className='text-lg'>Jadwal Pelajaran</CardTitle>
          </CardHeader>
          <CardContent className='overflow-x-auto p-2 md:p-6'>
            {jadwalPelajaran.length === 0 ? (
              <EmptyState
                title='Jadwal Kosong'
                description='Belum ada jadwal pelajaran untuk ditampilkan.'
              />
            ) : (
              <table className='w-full table-auto border-collapse text-sm'>
                <thead className='bg-primary/10 text-primary'>
                  <tr>
                    <th className='border p-2'>Hari</th>
                    <th className='border p-2'>Jam</th>
                    <th className='border p-2'>Mata Pelajaran</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwalPelajaran.map((jadwal, idx) => (
                    <tr key={idx} className='transition hover:bg-muted/40'>
                      <td className='border p-2'>{jadwal.hari}</td>
                      <td className='border p-2'>
                        {jadwal.jamMulai} - {jadwal.jamSelesai}
                      </td>
                      <td className='border p-2 font-medium'>
                        {jadwal.namaMapel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Beranda Informasi */}
        <Card className='border border-gray-200 shadow-md transition hover:shadow-lg'>
          <CardHeader className='flex items-center gap-2'>
            <Info className='h-5 w-5 text-primary' />
            <CardTitle className='text-lg'>Beranda Informasi</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 p-2 md:p-6'>
            {pengumuman.length > 0 ? (
              pengumuman.map((info, i) => (
                <div
                  key={i}
                  onClick={() => openModal(info)}
                  className='cursor-pointer rounded-lg border bg-blue-50 p-3 text-sm shadow-sm transition hover:bg-blue-100'
                >
                  <div className='font-semibold'>{info.title}</div>
                  <div
                    className='text-xs text-muted-foreground'
                    dangerouslySetInnerHTML={{ __html: info?.content }}
                  />
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Belum ada pengumuman terbaru.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Detail Pengumuman */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>{selectedPengumuman?.title}</DialogTitle>
          </DialogHeader>
          <div className='mt-2 text-sm text-muted-foreground'>
            <div
              dangerouslySetInnerHTML={{
                __html: selectedPengumuman?.content || ''
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
