'use client';

import {
  LogIn,
  LogOut,
  Info,
  CalendarClock,
  Award,
  BookOpen,
  CreditCardIcon,
  ScrollTextIcon,
  NewspaperIcon,
  AlertTriangleIcon,
  FileTextIcon,
  PiggyBankIcon,
  BadgeCheck,
  School,
  CalendarIcon,
  UsersIcon,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { signOut, useSession } from 'next-auth/react';
import MenuFiturSiswa from './menu-siswa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import BottomNav from './bottom-nav';

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

export default function SiswaHomeView() {
  const router = useRouter();
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [jadwalPelajaran, setJadwalPelajaran] = useState<JadwalPelajaran[]>([]);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  console.log(session?.user);

  const getData = async () => {
    try {
      const res = await api.get(`siswa`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      if (res.status === 200) {
        setKelas(res.data.result.kelasAktif);
        setJadwalPelajaran(res.data.result.jadwalPelajaran);
        setPengumuman(res.data.result.berandaInformasi);
      }

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [session]);

  const getInitials = (nama?: string) => {
    if (!nama) return '';

    const parts = nama.trim().split(' ');
    if (parts.length === 1) {
      // kalau cuma satu kata → ambil huruf pertama
      return parts[0][0];
    }

    // kalau ada lebih dari satu kata → ambil huruf pertama kata 1 & kata 2
    return parts[0][0] + parts[1][0];
  };
  const initials = getInitials(session?.user?.nama);

  const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&format=png`;

  console.log(avatarUrl);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login-siswa' });
  };

  const handleChangePassword = () => {
    router.push('/siswa/ubah-password');
  };

  return (
    <div className='mx-auto'>
      {/* Profil Siswa */}
      <div className='relative bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        <div className='flex items-center justify-between'>
          {/* Left side */}
          <div>
            <h2 className='text-lg font-bold md:text-2xl'>
              Hi, {session?.user?.nama}
            </h2>
            <p className='text-sm opacity-90'>{session?.user?.nip}</p>
          </div>

          {/* Right side */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='relative h-12 w-12 overflow-hidden rounded-full border-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2'>
                <Image
                  src={session?.user?.foto || avatarUrl}
                  alt='Foto Siswa'
                  width={100}
                  height={100}
                  className='h-full w-full object-cover'
                />
                <BadgeCheck className='absolute bottom-0 right-0 h-5 w-5 rounded-full bg-white text-green-500 shadow' />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem onClick={handleChangePassword}>
                <Lock className='mr-2 h-4 w-4 text-blue-500' />
                <span>Ubah Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className='mr-2 h-4 w-4 text-red-500' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='absolute -z-10 h-[30vh] w-full rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white shadow-md'></div>

      {/* Shortcut Fitur */}
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
                        <CalendarIcon className='h-4 w-4 text-blue-500' />
                        {kelasItem.tahunAjaran}
                      </p>
                      <p className='flex items-center gap-1'>
                        <UsersIcon className='h-4 w-4 text-green-500' />
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
                  className='rounded-lg border bg-blue-50 p-3 text-sm shadow-sm transition hover:bg-blue-100'
                >
                  <div className='font-semibold'>{info.title}</div>
                  <div
                    className='text-xs text-muted-foreground'
                    dangerouslySetInnerHTML={{ __html: info?.content }}
                  ></div>
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
      <BottomNav />
    </div>
  );
}

function Fitur({
  icon,
  label,
  href
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className='gap- flex flex-col items-center rounded-xl border bg-background p-2 transition-transform hover:scale-105 hover:shadow-md'
    >
      <div className='flex h-5 w-5 items-center justify-center text-primary lg:h-10 lg:w-10'>
        {icon}
      </div>
      <span className='text-center text-[10px] font-semibold text-muted-foreground md:text-sm lg:text-[17px]'>
        {label}
      </span>
    </Link>
  );
}
