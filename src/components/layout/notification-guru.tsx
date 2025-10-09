'use client';

import { useMemo } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

// -------- FETCHER --------
const getNotifikasi = async (token: string) => {
  const res = await api.get('notifikasi', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return res.data.data; // pastikan sesuai struktur backend → { total, uniqueNotif }
};

export default function NotificationGuru() {
  const { data: session } = useSession();

  // React Query fetch
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifikasi', session?.user?.idGuru], // key unik per user
    queryFn: () => getNotifikasi(session?.user?.token as string),
    enabled: !!session?.user?.token // hanya jalan kalau ada token
  });

  console.log(data);

  // default fallback
  const notifikasi = data?.uniqueNotif || [];
  const unreadCount = data?.total || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative rounded-full hover:bg-gray-100'
        >
          <Bell className='h-6 w-6' />
          <span className='absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow ring-2 ring-white'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='max-h-96 w-80 overflow-y-auto rounded-xl shadow-lg'
      >
        {isLoading && (
          <div className='p-4 text-center text-sm text-gray-500'>
            Memuat notifikasi...
          </div>
        )}

        {isError && (
          <div className='p-4 text-center text-sm text-red-500'>
            Gagal memuat notifikasi
          </div>
        )}

        {!isLoading && notifikasi.length === 0 && (
          <div className='p-4 text-center text-sm text-gray-500'>
            Tidak ada notifikasi
          </div>
        )}

        {notifikasi.map((notif: any) => (
          <DropdownMenuItem
            key={notif.id}
            className={cn(
              'flex cursor-pointer flex-col items-start gap-1 rounded-lg px-4 py-3',
              notif.status === 'unread'
                ? 'bg-gray-100'
                : 'bg-white hover:bg-gray-50'
            )}
          >
            <div className='flex w-full justify-between'>
              <span className='text-sm font-semibold'>{notif.kategori}</span>
              <span className='text-xs text-gray-400'>
                {new Date(notif.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className='text-sm text-gray-600'>{notif.keterangan}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
