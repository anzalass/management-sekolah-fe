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
  CalendarCheck,
  CalendarArrowUp,
  NotebookText
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
      color: 'text-indigo-500'
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
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/pengumuman',
      icon: <NewspaperIcon />,
      label: 'Pengumuman',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/pelanggaran',
      icon: <AlertTriangleIcon />,
      label: 'Pelanggaran',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/prestasi',
      icon: <Award />,
      label: 'Prestasi',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/log-presensi',
      icon: <FileTextIcon />,
      label: 'Log Presensi',
      color: 'text-indigo-500'
    }
  ];

  const fiturTambahan = [
    {
      href: '/siswa/rapot',
      icon: <BookOpen />,
      label: 'Rapot',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/janji-temu',
      icon: <CalendarClock />,
      label: 'Janji Temu',
      color: 'text-indigo-500'
    },

    {
      href: '/siswa/kalender-akademik',
      icon: <CalendarArrowUp />,
      label: 'Kalender Akademik',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/nilai-siswa',
      icon: <ClipboardList />,
      label: 'Nilai Siswa',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/perpustakaan',
      icon: <BookCopy />,
      label: 'Perpustakaan',
      color: 'text-indigo-500'
    },

    {
      href: '/siswa/weekly-activity',
      icon: <CalendarCheck />,
      label: 'Weekly Activity',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/weekly-activity',
      icon: <NotebookText />,
      label: 'Catatan Harian Siswa',
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className='grid grid-cols-4 gap-2 rounded-b-2xl bg-blue-800 px-4 sm:grid-cols-4 md:gap-3 lg:grid-cols-8'>
      {fiturUtama.map((fitur, i) => (
        <Link
          key={i}
          href={fitur.href}
          className='group flex flex-col items-center justify-center rounded-xl py-2 transition hover:shadow-md'
        >
          <div
            className={`mb-2 rounded-full bg-gray-100 p-4 text-3xl transition-transform group-hover:scale-110 ${fitur.color}`}
          >
            {fitur.icon}
          </div>
          <span className='text-center text-xs font-medium text-white sm:text-sm'>
            {fitur.label}
          </span>
        </Link>
      ))}

      {/* Load More */}
      <Dialog>
        <DialogTrigger asChild>
          <button className='group flex flex-col items-center justify-center rounded-xl py-3 transition hover:shadow-md'>
            <div className='mb-2 rounded-full bg-gray-100 p-4 text-3xl text-gray-600 transition-transform group-hover:scale-110'>
              <MoreHorizontal className='text-indigo-500' />
            </div>
            <span className='text-center text-xs font-medium text-white sm:text-sm'>
              Menu Lainnya
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className='max-w-lg rounded-lg'>
          <DialogTitle>Fitur Lainnya</DialogTitle>
          <div className='grid grid-cols-3 gap-4'>
            {fiturTambahan.map((fitur, i) => (
              <Link
                key={i}
                href={fitur.href}
                className='group flex flex-col items-center justify-center rounded-xl py-3 transition hover:bg-blue-50 hover:shadow-md'
              >
                <div
                  className={`mb-2 rounded-full bg-gray-100 p-4 text-3xl transition-transform group-hover:scale-110 ${fitur.color}`}
                >
                  {fitur.icon}
                </div>
                <span className='text-center text-xs font-medium sm:text-sm'>
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
