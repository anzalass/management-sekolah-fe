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

  const stripHtml = (html: any) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (siswaLoading || notifLoading) return <Loading />;

  return (
    <div className='mx-auto mb-32 min-h-screen'>
      {/* Profil Siswa */}
      <div
        className={`relative overflow-hidden ${process.env.NEXT_PUBLIC_THEME_COLOR} p-6 text-white`}
      >
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

      <div
        className={`${process.env.NEXT_PUBLIC_THEME_COLOR} absolute -z-10 h-[50vh] w-full rounded-b-[3rem]`}
      ></div>

      <MenuFiturSiswa />

      {/* --- Daftar Kelas --- */}
      <div className='mt-8 space-y-8 px-4 md:px-8'>
        <Card className='hover: border-2 border-purple-200/50 bg-white/95 p-6 backdrop-blur-sm transition-all duration-300'>
          <div className='pb-4 pt-2'>
            <CardTitle
              className={`${process.env.NEXT_PUBLIC_THEME_COLOR} bg-clip-text text-base font-bold text-transparent md:text-xl`}
            >
              ✨ Active Classroom
            </CardTitle>
          </div>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {kelas.length > 0 ? (
              kelas.map((kelasItem) => (
                <Link
                  href={`/siswa/kelas/${kelasItem.id}`}
                  key={kelasItem.id}
                  className='group'
                >
                  <Card className='h-full overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                    {/* Banner */}
                    <div className='relative h-40 overflow-hidden'>
                      {kelasItem.banner ? (
                        // Jika ada gambar
                        <>
                          <img
                            src={kelasItem.banner}
                            alt={kelasItem.namaMapel}
                            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                        </>
                      ) : (
                        // Jika tidak ada gambar → tampilkan inisial
                        <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                          <span className='text-3xl font-bold text-white drop-shadow-md'>
                            {getInitials(kelasItem.namaMapel)}
                          </span>
                        </div>
                      )}

                      {/* Floating Badge (tetap muncul di semua kasus) */}
                      <div className='absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm'>
                        <span className='text-xs font-semibold text-gray-900'>
                          {kelasItem.tahunAjaran}
                        </span>
                      </div>
                    </div>

                    {/* Content (sama seperti sebelumnya) */}
                    <div className='p-5'>
                      <CardTitle className='mb-3 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                        {kelasItem.namaMapel}
                      </CardTitle>

                      <div className='space-y-2.5 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-2'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
                            <span className='text-xs font-semibold text-gray-600'>
                              {kelasItem.namaGuru.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className='line-clamp-1 font-medium text-gray-700'>
                            {kelasItem.namaGuru}
                          </span>
                        </div>

                        <div className='flex items-center justify-between pt-2'>
                          <div className='flex items-center gap-1.5'>
                            <CalendarIcon className='h-4 w-4 text-gray-400' />
                            <span className='text-xs'>
                              {kelasItem.tahunAjaran}
                            </span>
                          </div>
                          <div className='flex items-center gap-1.5'>
                            <UsersIcon className='h-4 w-4 text-gray-400' />
                            <span className='text-xs font-medium'>
                              {kelasItem.totalSiswa} Student
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className='h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
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

        {/* Pengumuman */}
        <Card className='hover: overflow-hidden border-2 border-purple-200/50 bg-white/95 backdrop-blur-sm transition-all duration-300'>
          <CardHeader className=''>
            <div className='flex items-center gap-3'>
              <div
                className={`rounded-lg ${process.env.NEXT_PUBLIC_THEME_COLOR} p-2.5`}
              >
                <Info className='h-5 w-5 text-white' />
              </div>
              <CardTitle
                className={`${process.env.NEXT_PUBLIC_THEME_COLOR} bg-clip-text text-lg font-bold text-transparent`}
              >
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
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 hover:scale-[1.02] ${
                    i === 0
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div
                    className={`mb-2 font-bold ${
                      i === 0
                        ? 'text-lg text-purple-800'
                        : 'text-purple-900 group-hover:text-fuchsia-700'
                    }`}
                  >
                    {info.title}
                  </div>
                  <p className='mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600'>
                    {stripHtml(info.content)}
                  </p>
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
        <Card className='hover: mb-40 overflow-hidden border-2 border-purple-200/50 bg-white/95 backdrop-blur-sm transition-all duration-300'>
          <CardHeader className=''>
            <div className='flex items-center gap-3'>
              <div
                className={`${process.env.NEXT_PUBLIC_THEME_COLOR} rounded-lg p-2.5`}
              >
                <CalendarClock className='h-5 w-5 text-white' />
              </div>
              <CardTitle
                className={`${process.env.NEXT_PUBLIC_THEME_COLOR} bg-clip-text text-base font-bold text-transparent`}
              >
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
      </div>

      {/* Modal Detail Pengumuman */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='flex max-h-[90vh] max-w-lg flex-col overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50'>
          <DialogHeader>
            <DialogTitle className='bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-xl font-bold text-transparent'>
              {selectedPengumuman?.title}
            </DialogTitle>
          </DialogHeader>

          {/* CONTENT SCROLL AREA */}
          <div className='mt-4 flex-1 overflow-y-auto rounded-lg bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-inner'>
            <div
              className='prose max-w-none'
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
