'use client';

import Link from 'next/link';
import { Home, BookOpen, CalendarCheck, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', icon: Home, href: '/siswa' },
  { label: 'CLassroom', icon: BookOpen, href: '/siswa/kelas' },
  {
    label: 'Weekly Activity',
    icon: CalendarCheck,
    href: '/siswa/weekly-activity'
  },
  { label: 'Score', icon: BarChart3, href: '/siswa/nilai-siswa' }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 ${process.env.NEXT_PUBLIC_THEME_COLOR} shadow-2xl backdrop-blur-md md:hidden`}
    >
      <div className='flex justify-around px-2 py-2'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-white transition-all duration-300 ease-out ${
                isActive
                  ? 'bg-white/20 shadow-inner'
                  : 'hover:bg-white/15 active:bg-white/25'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-300 ${
                  isActive
                    ? 'scale-110 text-white'
                    : 'text-gray-200 group-hover:scale-110'
                }`}
              />
              <span
                className={`transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-200 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
