'use client';

import Link from 'next/link';
import { Home, BookOpen, CalendarCheck, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', icon: Home, href: '/siswa' },
  { label: 'Kelas', icon: BookOpen, href: '/siswa/kelas' },
  { label: 'Weekly', icon: CalendarCheck, href: '/siswa/weekly-activity' },
  { label: 'Nilai', icon: BarChart3, href: '/siswa/nilai-siswa' }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 border-t border-t-blue-400 bg-white shadow-lg md:hidden'>
      <div className='flex justify-around'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-2 text-xs ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <Icon className={`mb-1 h-5 w-5`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
