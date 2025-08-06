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
  UsersIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export default function SiswaHomeView() {
  const [search, setSearch] = useState('');

  const siswa = {
    nama: 'Rama Wijaya',
    nis: '20231234',
    kelas: 'Primary 3',
    foto: 'https://randomuser.me/api/portraits/men/75.jpg'
  };

  const informasiBeranda = [
    {
      id: 1,
      title: 'Kegiatan Class Meeting',
      content:
        'Class Meeting dimulai tanggal 20 Juni 2025. Harap hadir tepat waktu!'
    },
    {
      id: 2,
      title: 'Pengambilan Raport',
      content:
        'Raport dapat diambil oleh orang tua siswa pada tanggal 25 Juni 2025.'
    }
  ];

  interface Kelas {
    id: number;
    nama: string;
    waliKelas: string;
    tahunAjaran: string;
    jumlahSiswa: number;
    imageUrl: string;
  }

  const dummyKelas: Kelas[] = [
    {
      id: 1,
      nama: 'Primary 1 - Matematika Dasar',
      waliKelas: 'Bu Ani',
      tahunAjaran: '2024/2025',
      jumlahSiswa: 25,
      imageUrl:
        'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0' // Belajar Matematika
    },
    {
      id: 2,
      nama: 'Primary 2 - Bahasa Indonesia',
      waliKelas: 'Pak Budi',
      tahunAjaran: '2024/2025',
      jumlahSiswa: 27,
      imageUrl:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0' // Anak membaca
    },
    {
      id: 3,
      nama: 'Primary 3 - Ilmu Pengetahuan Alam',
      waliKelas: 'Bu Sinta',
      tahunAjaran: '2024/2025',
      jumlahSiswa: 30,
      imageUrl:
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmF0dXJlfGVufDB8fDB8fHww' // Anak eksperimen sains
    },
    {
      id: 4,
      nama: 'Primary 4 - Pendidikan Kewarganegaraan',
      waliKelas: 'Pak Dedi',
      tahunAjaran: '2024/2025',
      jumlahSiswa: 28,
      imageUrl:
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0' // Anak belajar bersama
    }
  ];

  const jadwalPelajaran = [
    { hari: 'Senin', jam: '07.00 - 08.30', mapel: 'Matematika Wajib' },
    { hari: 'Senin', jam: '08.30 - 10.00', mapel: 'Bahasa Indonesia' },
    { hari: 'Selasa', jam: '07.00 - 08.30', mapel: 'Kimia' },
    { hari: 'Rabu', jam: '09.00 - 10.30', mapel: 'Fisika' },
    { hari: 'Kamis', jam: '10.30 - 12.00', mapel: 'Bahasa Inggris' },
    { hari: 'Jumat', jam: '07.00 - 08.30', mapel: 'Agama' }
  ];

  const handleAbsen = (type: 'masuk' | 'pulang') => {
    alert(`Absen ${type} berhasil!`);
  };

  const filteredKelas = dummyKelas.filter((k) =>
    k.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-2 md:p-4'>
      {/* Profil Siswa */}
      <div className='flex items-center justify-between rounded-2xl bg-white'>
        <div>
          <h2 className='text-xl font-bold text-gray-800'>
            {siswa.nama}, {siswa.kelas}
          </h2>
        </div>
        <div className='relative'>
          <img
            src={siswa.foto}
            alt='Foto Siswa'
            className='h-10 w-10 rounded-full object-cover ring-4 ring-primary'
          />
          <BadgeCheck className='absolute bottom-0 right-0 h-4 w-4 rounded-full bg-white text-green-500 shadow' />
        </div>
      </div>

      {/* Absen Masuk & Pulang */}
      <div className='flex gap-4'>
        <Button
          className='w-full bg-green-600 text-white hover:bg-green-700 md:w-auto'
          onClick={() => handleAbsen('masuk')}
        >
          <LogIn className='mr-2 h-4 w-4' /> Absen Masuk
        </Button>
        <Button
          className='w-full bg-red-600 text-white hover:bg-red-700 md:w-auto'
          onClick={() => handleAbsen('pulang')}
        >
          <LogOut className='mr-2 h-4 w-4' /> Absen Pulang
        </Button>
      </div>
      {/* Fitur Akses */}
      <div className='grid grid-cols-4 items-center justify-center gap-3 sm:grid-cols-5 md:gap-4'>
        <Fitur
          href='/siswa/pembayaran'
          icon={<CreditCardIcon className='text-blue-500' />}
          label='Pembayaran'
        />
        <Fitur
          href='/siswa/kelas'
          icon={<School className='text-black' />}
          label='Kelas'
        />
        <Fitur
          href='/siswa/perizinan'
          icon={<ScrollTextIcon className='text-yellow-500' />}
          label='Perizinan'
        />
        <Fitur
          href='/siswa/pengumuman'
          icon={<NewspaperIcon className='text-cyan-500' />}
          label='Pengumuman'
        />
        <Fitur
          href='/siswa/pelanggaran'
          icon={<AlertTriangleIcon className='text-red-500' />}
          label='Pelanggaran'
        />
        <Fitur
          href='/siswa/prestasi'
          icon={<Award className='text-green-500' />}
          label='Prestasi'
        />
        <Fitur
          href='/siswa/log-presensi'
          icon={<FileTextIcon className='text-purple-500' />}
          label='Log Presensi'
        />
        <Fitur
          href='/siswa/log-tabungan'
          icon={<PiggyBankIcon className='text-pink-500' />}
          label='Tabungan'
        />
        <Fitur
          href='/siswa/rapot'
          icon={<BookOpen className='text-orange-500' />}
          label='Rapot'
        />
      </div>
      {/* Daftar Kelas */}
      <Card className='border border-secondary p-2 shadow md:p-5'>
        <CardHeader>
          <CardTitle className='text-lg'>Daftar Kelas Aktif</CardTitle>
        </CardHeader>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {filteredKelas.length > 0 ? (
            filteredKelas.map((kelas) => (
              <Link href={'siswa/kelas/abc'}>
                <Card
                  key={kelas.id}
                  className='cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md'
                >
                  <img
                    src={kelas.imageUrl}
                    alt={kelas.nama}
                    className='h-32 w-full object-cover'
                  />
                  <CardHeader>
                    <CardTitle className='text-lg font-semibold'>
                      {kelas.nama}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-muted-foreground'>
                    <p>Wali Kelas: {kelas.waliKelas}</p>
                    <p className='flex items-center gap-1'>
                      <CalendarIcon className='h-4 w-4' />
                      {kelas.tahunAjaran}
                    </p>
                    <p className='flex items-center gap-1'>
                      <UsersIcon className='h-4 w-4' />
                      {kelas.jumlahSiswa} siswa
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
      <Card className='border border-secondary shadow'>
        <CardHeader className='flex items-center gap-2'>
          <CalendarClock className='h-5 w-5 text-primary' />
          <CardTitle className='text-lg'>Jadwal Pelajaran</CardTitle>
        </CardHeader>
        <CardContent className='overflow-x-auto p-2 md:p-6'>
          <table className='w-full table-auto text-sm'>
            <thead className='bg-primary/10 text-primary'>
              <tr>
                <th className='border p-2'>Hari</th>
                <th className='border p-2'>Jam</th>
                <th className='border p-2'>Mata Pelajaran</th>
              </tr>
            </thead>
            <tbody>
              {jadwalPelajaran.map((jadwal, idx) => (
                <tr key={idx} className='hover:bg-muted/40'>
                  <td className='border p-2'>{jadwal.hari}</td>
                  <td className='border p-2'>{jadwal.jam}</td>
                  <td className='border p-2'>{jadwal.mapel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Beranda Informasi */}
      <Card className='border border-secondary shadow'>
        <CardHeader className='flex items-center gap-2'>
          <Info className='h-5 w-5 text-primary' />
          <CardTitle className='text-lg'>Beranda Informasi</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3 p-2 md:p-6'>
          {informasiBeranda.map((info) => (
            <div
              key={info.id}
              className='rounded border bg-muted/30 p-3 text-sm shadow-sm hover:bg-muted'
            >
              <div className='font-medium'>{info.title}</div>
              <p className='text-xs text-muted-foreground'>{info.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>
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
      className='flex flex-col items-center gap-2 rounded-xl border bg-background p-2 shadow-sm transition-transform hover:scale-105 hover:shadow-md'
    >
      <div className='flex h-5 w-5 items-center justify-center text-primary'>
        {icon}
      </div>
      <span className='text-[10px] font-semibold text-muted-foreground md:text-sm'>
        {label}
      </span>
    </Link>
  );
}
