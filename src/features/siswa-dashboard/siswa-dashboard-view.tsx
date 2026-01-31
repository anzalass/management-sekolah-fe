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

  const handleLogout = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();

        if (sub) {
          await api.post(
            '/auth/logout',
            {
              endpoint: sub.endpoint
            },
            {
              headers: {
                Authorization: `Bearer ${session?.user?.token}`
              },
              withCredentials: true // ✅ ini yang kamu maksud
            }
          );

          await sub.unsubscribe(); // 🔥 stop push dari browser
        }
      }

      await signOut({ callbackUrl: '/login-siswa' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  async function toggleNotification() {
    if (!('serviceWorker' in navigator)) return;
    if (!('PushManager' in window)) return;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.error('VAPID public key not found');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey)
    });

    const p256dhKey = subscription.getKey('p256dh');
    const authKey = subscription.getKey('auth');

    await api.post(
      '/notifikasi/subscribe',
      {
        endpoint: subscription.endpoint,
        p256dh: p256dhKey ? arrayBufferToBase64(p256dhKey) : null,
        auth: authKey ? arrayBufferToBase64(authKey) : null,
        userAgent: navigator.userAgent
      },
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      }
    );
  }

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(true);

  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (!('serviceWorker' in navigator)) {
        setLoadingNotif(false);
        return;
      }

      const permission = Notification.permission;
      if (permission !== 'granted') {
        setNotifEnabled(false);
        setLoadingNotif(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      setNotifEnabled(!!sub);
      setLoadingNotif(false);
    };

    checkNotificationStatus();
  }, []);

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
        <div className='relative flex items-center justify-between'>
          {/* LEFT */}
          <div className='space-y-1'>
            <h2 className='text-base font-bold md:text-2xl'>
              Hi,{' '}
              {session?.user?.nama.length > 11
                ? session?.user?.nama.slice(0, 11) + '...'
                : session?.user?.nama}{' '}
              👋
            </h2>
            <p className='text-xs font-medium opacity-90'>
              {session?.user?.nip}
            </p>
          </div>

          {/* RIGHT */}
          <div className='relative flex items-center gap-4'>
            {/* 🔔 NOTIF TOGGLE */}

            {/* 🔔 BELL */}
            {/* 🔔 BELL */}
            <div className='relative'>
              <Link
                onClick={handlerNotifikasi}
                href='/siswa/notifikasi'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30'
              >
                <Bell size={20} className='text-white' />
              </Link>

              <span
                className={`absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white ring-2 ring-white ${
                  totalNotif
                    ? 'animate-bounce bg-gradient-to-r from-rose-500 to-pink-600'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                } `}
              >
                {totalNotif > 99 ? '99+' : totalNotif || 0}
              </span>
            </div>

            {/* 👤 PROFILE */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='relative h-11 w-11 overflow-hidden rounded-full border-2 border-white ring-4 ring-white/30 transition-all hover:scale-110 hover:ring-white/50'>
                  <Image
                    src={session?.user?.foto || avatarUrl}
                    alt='Foto'
                    width={100}
                    height={100}
                    className='h-full w-full object-cover'
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem
                  onClick={toggleNotification}
                  className='cursor-pointer'
                >
                  <Bell className='mr-2 h-4 w-4 text-yellow-600' />
                  Enable Notification
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleChangePassword}
                  className='cursor-pointer'
                >
                  <Lock className='mr-2 h-4 w-4 text-purple-600' /> Change
                  Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='cursor-pointer'
                >
                  <LogOut className='mr-2 h-4 w-4 text-rose-600' />
                  Logout
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
        <Card className='border-2 border-purple-200/50 bg-white/95 p-6'>
          <CardTitle
            className={`${process.env.NEXT_PUBLIC_THEME_COLOR} mb-4 bg-clip-text text-lg font-bold text-transparent`}
          >
            ✨ Active Classroom
          </CardTitle>

          <div className='scrollbar-hide flex gap-4 overflow-x-auto pb-2'>
            {kelas.map((kelasItem) => (
              <Link
                key={kelasItem.id}
                href={`/siswa/kelas/${kelasItem.id}`}
                className='min-w-[260px] flex-shrink-0'
              >
                <Card className='overflow-hidden border shadow-sm hover:shadow-md'>
                  <div className='relative h-32'>
                    {kelasItem.banner ? (
                      <img
                        src={kelasItem.banner}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white'>
                        {getInitials(kelasItem.namaMapel)}
                      </div>
                    )}
                  </div>

                  <div className='p-4'>
                    <h3 className='line-clamp-2 text-sm font-bold'>
                      {kelasItem.namaMapel}
                    </h3>
                    <p className='mt-1 text-xs text-gray-600'>
                      {kelasItem.namaGuru}
                    </p>

                    <div className='mt-2 flex justify-between text-xs text-gray-500'>
                      <span>{kelasItem.tahunAjaran}</span>
                      <span>{kelasItem.totalSiswa} siswa</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Card>

        {/* Pengumuman */}
        <Card className='border-2 border-purple-200/50 bg-white/95'>
          <CardHeader>
            <CardTitle className='text-lg font-bold text-purple-700'>
              📢 Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='scrollbar-hide flex gap-4 overflow-x-auto pb-2'>
              {pengumuman.map((info, i) => (
                <div
                  key={i}
                  onClick={() => openModal(info)}
                  className='min-w-[280px] cursor-pointer rounded-xl border p-4 hover:shadow-md'
                >
                  <h4 className='mb-2 text-sm font-bold text-purple-800'>
                    {info.title}
                  </h4>
                  <p className='line-clamp-3 text-xs text-gray-600'>
                    {stripHtml(info.content)}
                  </p>
                </div>
              ))}
            </div>
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
