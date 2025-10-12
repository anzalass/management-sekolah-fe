'use client';

import { useState, useEffect } from 'react';
import {
  LogOut,
  Info,
  CalendarClock,
  CalendarIcon,
  UsersIcon,
  Lock,
  Bell,
  Users
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
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
  const queryClient = useQueryClient(); // ✅ untuk invalidasi query

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] =
    useState<Pengumuman | null>(null);

  // --- Fetchers ---
  const fetchSiswaData = async (): Promise<SiswaData> => {
    if (!session?.user?.token)
      return { kelasAktif: [], jadwalPelajaran: [], berandaInformasi: [] };

    const res = await api.get('siswa', {
      headers: {
        Authorization: `Bearer ${session.user.token}`
      }
    });
    return res.data.result as SiswaData;
  };

  const fetchNotifikasi = async (): Promise<number> => {
    if (!session?.user?.token) return 0;
    const res = await api.get('notifikasi-total', {
      headers: {
        Authorization: `Bearer ${session.user.token}`
      }
    });
    return res.data.data.total;
  };

  // --- Query siswa data ---
  const {
    data: siswaData,
    error: siswaError,
    isLoading: siswaLoading
  } = useQuery<SiswaData>({
    queryKey: ['siswa-data'],
    queryFn: fetchSiswaData,
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 20
  });

  // --- Query notifikasi ---
  const {
    data: totalNotif,
    error: notifError,
    isLoading: notifLoading
  } = useQuery<number>({
    queryKey: ['notifikasi'],
    queryFn: fetchNotifikasi,
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 20
  });

  console.log(totalNotif);

  useEffect(() => {
    if (siswaError || notifError) {
      toast.error('Terjadi kesalahan saat memuat data');
    }
  }, [siswaError, notifError]);

  const kelas: Kelas[] = siswaData?.kelasAktif ?? [];
  const jadwalPelajaran: JadwalPelajaran[] = siswaData?.jadwalPelajaran ?? [];
  const pengumuman: Pengumuman[] = siswaData?.berandaInformasi ?? [];

  // --- Avatar & Logout ---
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

  // --- ✅ Mutation notifikasi ---
  const { mutate: markAllNotifikasi, isPending: updatingNotif } = useMutation({
    mutationFn: async () => {
      const res = await api.put(
        'notifikasi/siswa',
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Semua notifikasi telah diperbarui');
      // invalidate cache biar jumlah notifikasi refresh
      queryClient.invalidateQueries({ queryKey: ['notifikasi'] });
    },
    onError: () => {
      toast.error('Gagal memperbarui notifikasi');
    }
  });

  // --- handler trigger ---
  const handlerNotifikasi = () => {
    markAllNotifikasi();
  };

  // ... return JSX (UI) kamu seperti biasa

  if (siswaLoading || notifLoading) return <Loading />;

  return (
    <div className='mx-auto mb-14 min-h-screen'>
      {/* Profil Siswa */}
      <div className='relative overflow-hidden bg-blue-800 p-6 text-white'>
        {/* Decorative circles */}

        <div className='relative flex items-center justify-between'>
          <div className='space-y-1'>
            <h2 className='drop- text-base font-bold md:text-2xl'>
              Hi, {session?.user?.nama} 👋
            </h2>
            <p className='text-xs font-medium opacity-90 drop-shadow'>
              {session?.user?.nip}
            </p>
          </div>

          <div className='relative flex items-center gap-3'>
            <div className='relative'>
              <div className='rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30'>
                <Link onClick={handlerNotifikasi} href={'/siswa/notifikasi'}>
                  <Bell size={24} className='drop- text-white' />
                </Link>
              </div>
              {totalNotif ? (
                <span className='absolute -right-1 -top-1 flex h-5 min-w-[20px] animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-1.5 text-[10px] font-bold text-white ring-2 ring-white'>
                  {totalNotif > 99 ? '99+' : totalNotif}
                </span>
              ) : (
                <span className='absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-1.5 text-[10px] font-bold text-white ring-2 ring-white'>
                  0
                </span>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='border-3 relative h-11 w-11 overflow-hidden rounded-full border-white ring-4 ring-white/30 transition-all hover:scale-110 hover:ring-white/50 focus:outline-none md:h-12 md:w-12'>
                  <Image
                    src={session?.user?.foto || avatarUrl}
                    alt='Foto Siswa'
                    width={100}
                    height={100}
                    className='h-full w-full object-cover'
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-48 border-purple-200'
              >
                <DropdownMenuItem
                  onClick={handleChangePassword}
                  className='cursor-pointer'
                >
                  <Lock className='mr-2 h-4 w-4 text-purple-600' /> Ubah
                  Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='cursor-pointer'
                >
                  <LogOut className='mr-2 h-4 w-4 text-rose-600' /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className='absolute -z-10 h-[50vh] w-full rounded-b-[3rem] bg-blue-800'></div>

      <MenuFiturSiswa />

      {/* --- Daftar Kelas --- */}
      <div className='mt-8 space-y-8 px-4 md:px-8'>
        <Card className='hover: border-2 border-purple-200/50 bg-white/95 p-6 backdrop-blur-sm transition-all duration-300'>
          <div className='pb-4 pt-2'>
            <CardTitle className='bg-blue-800 bg-clip-text text-base font-bold text-transparent md:text-xl'>
              ✨ Active Classroom
            </CardTitle>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {kelas.length > 0 ? (
              kelas.map((kelasItem) => (
                <Link href={`/siswa/kelas/${kelasItem.id}`} key={kelasItem.id}>
                  <Card className='hover: group cursor-pointer overflow-hidden rounded-2xl border-2 border-purple-100 bg-white transition-all duration-300 hover:scale-[1.03] hover:border-purple-300'>
                    <div className='relative overflow-hidden'>
                      <img
                        src={kelasItem.banner || '/banner-default.jpg'}
                        alt={kelasItem.nama}
                        className='h-36 w-full object-cover transition-transform duration-500 group-hover:scale-110'
                      />
                      <div className='absolute bottom-2 right-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-purple-600 backdrop-blur-sm'>
                        <Users className='mr-1 inline h-3 w-3' />
                        {kelasItem.totalSiswa}
                      </div>
                    </div>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-base font-bold text-purple-900 md:text-lg'>
                        {kelasItem.namaMapel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-xs md:text-sm'>
                      <p className='font-semibold text-slate-700'>
                        👨‍🏫 {kelasItem.namaGuru}
                      </p>
                      <p className='flex items-center gap-1.5 text-slate-600'>
                        <CalendarIcon className='h-4 w-4 text-violet-500' />
                        {kelasItem.tahunAjaran}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className='col-span-full rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-8 text-center'>
                <p className='text-sm font-medium text-purple-600'>
                  Tidak ada kelas ditemukan
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Jadwal */}
        <Card className='hover: overflow-hidden border-2 border-purple-200/50 bg-white/95 backdrop-blur-sm transition-all duration-300'>
          <CardHeader className=''>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-blue-800 p-2.5'>
                <CalendarClock className='h-5 w-5 text-white' />
              </div>
              <CardTitle className='bg-blue-800 bg-clip-text text-base font-bold text-transparent'>
                📅 Lesson Timetable
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='overflow-x-auto p-2 md:p-6'>
            {jadwalPelajaran.length === 0 ? (
              <EmptyState
                title='No Schedule'
                description='No Schedule Displayed'
              />
            ) : (
              <div className='overflow-hidden rounded-xl border-2 border-purple-100'>
                <table className='w-full table-auto border-collapse text-sm'>
                  <thead className='bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100'>
                    <tr>
                      <th className='border-b-2 border-purple-200 p-3 text-left font-bold text-purple-900'>
                        Day
                      </th>
                      <th className='border-b-2 border-purple-200 p-3 text-left font-bold text-purple-900'>
                        Time
                      </th>
                      <th className='border-b-2 border-purple-200 p-3 text-left font-bold text-purple-900'>
                        Subjects
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalPelajaran.map((jadwal, idx) => (
                      <tr
                        key={idx}
                        className='transition-all hover:bg-purple-50'
                      >
                        <td className='border-b border-purple-100 p-3 font-semibold text-slate-700'>
                          {jadwal.hari}
                        </td>
                        <td className='border-b border-purple-100 p-3 text-slate-600'>
                          <span className='rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700'>
                            {jadwal.jamMulai} - {jadwal.jamSelesai}
                          </span>
                        </td>
                        <td className='border-b border-purple-100 p-3 font-bold text-purple-900'>
                          {jadwal.namaMapel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pengumuman */}
        <Card className='hover: overflow-hidden border-2 border-purple-200/50 bg-white/95 backdrop-blur-sm transition-all duration-300'>
          <CardHeader className=''>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-blue-800 p-2.5'>
                <Info className='h-5 w-5 text-white' />
              </div>
              <CardTitle className='bg-blue-800 bg-clip-text text-lg font-bold text-transparent'>
                📢 Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-3 p-4 md:p-6'>
            {pengumuman.length > 0 ? (
              pengumuman.map((info, i) => (
                <div
                  key={i}
                  onClick={() => openModal(info)}
                  className='hover: group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-purple-300'
                >
                  <div className='mb-2 font-bold text-purple-900 group-hover:text-fuchsia-700'>
                    {info.title}
                  </div>
                  <div
                    className='text-xs leading-relaxed text-slate-600'
                    dangerouslySetInnerHTML={{ __html: info?.content }}
                  />
                </div>
              ))
            ) : (
              <div className='rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-8 text-center'>
                <p className='text-sm font-medium text-purple-600'>
                  No Information Yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Detail Pengumuman */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-lg border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50'>
          <DialogHeader>
            <DialogTitle className='bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-xl font-bold text-transparent'>
              {selectedPengumuman?.title}
            </DialogTitle>
          </DialogHeader>
          <div className='mt-4 rounded-lg bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-inner'>
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
