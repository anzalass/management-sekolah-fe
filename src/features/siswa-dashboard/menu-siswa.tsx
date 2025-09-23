import {
  CreditCardIcon,
  School,
  ScrollTextIcon,
  NewspaperIcon,
  AlertTriangleIcon,
  Award,
  FileTextIcon,
  BookOpen,
  CalendarClock,
  ClipboardList,
  MoreHorizontal,
  BookCopy,
  CalendarCheck
} from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function MenuFiturSiswa() {
  const fiturUtama = [
    {
      href: '/siswa/pembayaran',
      icon: <CreditCardIcon />,
      label: 'Pembayaran',
      color: 'text-blue-500'
    },
    {
      href: '/siswa/kelas',
      icon: <School />,
      label: 'Kelas',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/perizinan',
      icon: <ScrollTextIcon />,
      label: 'Perizinan',
      color: 'text-yellow-500'
    },
    {
      href: '/siswa/pengumuman',
      icon: <NewspaperIcon />,
      label: 'Pengumuman',
      color: 'text-cyan-500'
    },
    {
      href: '/siswa/pelanggaran',
      icon: <AlertTriangleIcon />,
      label: 'Pelanggaran',
      color: 'text-red-500'
    },
    {
      href: '/siswa/prestasi',
      icon: <Award />,
      label: 'Prestasi',
      color: 'text-green-500'
    },
    {
      href: '/siswa/log-presensi',
      icon: <FileTextIcon />,
      label: 'Log Presensi',
      color: 'text-purple-500'
    }
  ];

  const fiturTambahan = [
    {
      href: '/siswa/rapot',
      icon: <BookOpen />,
      label: 'Rapot',
      color: 'text-orange-500'
    },
    {
      href: '/siswa/janji-temu',
      icon: <CalendarClock />,
      label: 'Janji Temu',
      color: 'text-pink-500'
    },
    {
      href: '/siswa/nilai-siswa',
      icon: <ClipboardList />,
      label: 'Nilai Siswa',
      color: 'text-teal-500'
    },
    {
      href: '/siswa/perpustakaan',
      icon: <BookCopy />,
      label: 'Perpustakaan',
      color: 'text-black'
    },

    {
      href: '/siswa/weekly-activity',
      icon: <CalendarCheck />,
      label: 'Weekly Activity',
      color: 'text-fuchsia-500'
    }
  ];

  return (
    <div className='mt-10 grid grid-cols-4 gap-3 px-4 sm:grid-cols-4 md:gap-6 lg:grid-cols-8'>
      {fiturUtama.map((fitur, i) => (
        <Link
          key={i}
          href={fitur.href}
          className='group flex flex-col items-center justify-center rounded-xl border bg-white p-3 shadow transition hover:bg-blue-50 hover:shadow-md'
        >
          <div
            className={`mb-1 rounded-full bg-gray-100 p-2 transition-transform group-hover:scale-110 ${fitur.color}`}
          >
            {fitur.icon}
          </div>
          <span className='text-center text-[9px] font-medium sm:text-base'>
            {fitur.label}
          </span>
        </Link>
      ))}

      {/* Load More */}
      <Dialog>
        <DialogTrigger asChild>
          <button className='group flex flex-col items-center justify-center rounded-xl border bg-white p-3 shadow transition hover:bg-blue-50 hover:shadow-md'>
            <div className='mb-1 rounded-full bg-gray-100 p-2 text-gray-600 transition-transform group-hover:scale-110'>
              <MoreHorizontal />
            </div>
            <span className='text-center text-[9px] font-medium sm:text-base'>
              Load More
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className='max-w-lg'>
          <DialogTitle>Fitur Tambahan</DialogTitle>
          <div className='grid grid-cols-3 gap-4'>
            {fiturUtama.map((fitur, i) => (
              <Link
                key={i}
                href={fitur.href}
                className='group flex flex-col items-center justify-center rounded-xl border bg-white p-3 shadow transition hover:bg-blue-50 hover:shadow-md'
              >
                <div
                  className={`mb-1 rounded-full bg-gray-100 p-2 transition-transform group-hover:scale-110 ${fitur.color}`}
                >
                  {fitur.icon}
                </div>
                <span className='text-center text-[9px] font-medium sm:text-base'>
                  {fitur.label}
                </span>
              </Link>
            ))}
            {fiturTambahan.map((fitur, i) => (
              <Link
                key={i}
                href={fitur.href}
                className='group flex flex-col items-center justify-center rounded-xl border bg-white p-3 shadow transition hover:bg-blue-50 hover:shadow-md'
              >
                <div
                  className={`mb-1 rounded-full bg-gray-100 p-2 transition-transform group-hover:scale-110 ${fitur.color}`}
                >
                  {fitur.icon}
                </div>
                <span className='text-center text-[9px] font-medium sm:text-sm'>
                  {fitur.label}
                </span>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
