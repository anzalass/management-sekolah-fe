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
  NotebookText,
  UserCheck
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
      label: 'Payments',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/kelas',
      icon: <School />,
      label: 'Classroom',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/perizinan',
      icon: <ScrollTextIcon />,
      label: 'Permission',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/pengumuman',
      icon: <NewspaperIcon />,
      label: 'Announcment',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/pelanggaran',
      icon: <AlertTriangleIcon />,
      label: 'Violation',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/prestasi',
      icon: <Award />,
      label: 'Achivement',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/log-presensi',
      icon: <FileTextIcon />,
      label: 'Attendence',
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
      label: 'Apointment',
      color: 'text-indigo-500'
    },

    {
      href: '/siswa/kalender-akademik',
      icon: <CalendarArrowUp />,
      label: 'Calendar Academic',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/nilai-siswa',
      icon: <ClipboardList />,
      label: 'Student Score',
      color: 'text-indigo-500'
    },
    //E-Perpus di hilangkan dari modal ~ Unggul Prayuda
    // {
    //   href: '/siswa/perpustakaan',
    //   icon: <BookCopy />,
    //   label: 'Library',
    //   color: 'text-indigo-500'
    // },
    {
      href: '/siswa/weekly-activity',
      icon: <CalendarCheck />,
      label: 'Weekly Activity',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/catatan-perkembangan-siswa',
      icon: <NotebookText />,
      label: 'Student Development Notes',
      color: 'text-indigo-500'
    },
    {
      href: '/siswa/konseling',
      icon: <UserCheck />,
      label: 'Konseling',
      color: 'text-indigo-500'
    }
  ];

  return (
    <div
      className={`${process.env.NEXT_PUBLIC_THEME_COLOR} grid grid-cols-4 gap-2 rounded-b-2xl px-4 sm:grid-cols-4 md:gap-3 lg:grid-cols-8`}
    >
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
              More Feature
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className='max-w-lg rounded-lg bg-white'>
          <DialogTitle> More Feature</DialogTitle>
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
