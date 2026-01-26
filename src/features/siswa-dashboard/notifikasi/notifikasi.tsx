'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Filter,
  BookOpen,
  DollarSign,
  Award,
  AlertCircle,
  Calendar,
  FileText,
  Trash2
} from 'lucide-react';
import BottomNav from '../bottom-nav';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function NotificationPage() {
  const [filter, setFilter] = useState('all');
  const { data: session } = useSession();
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // === FETCH DATA DARI API ===
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['notifikasii'],
    queryFn: async () => {
      const res = await api.get('notifikasi', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`
        }
      });

      return res.data.data.uniqueNotif;
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 // cache 1 menit
  });

  // === CATEGORIES ===
  const categories = [
    { value: 'all', label: 'All', icon: Bell, color: 'text-gray-600' },
    { value: 'Tugas', label: 'Task', icon: BookOpen, color: 'text-blue-600' },
    {
      value: 'Materi',
      label: 'Lesson',
      icon: BookOpen,
      color: 'text-blue-600'
    },

    {
      value: 'Pembayaran',
      label: 'Payment',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      value: 'prestasi',
      label: 'Achivement',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      value: 'Nilai',
      label: 'Score',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      value: 'pengumuman',
      label: 'Announcment',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    {
      value: 'pelanggaran',
      label: '',
      icon: AlertCircle,
      color: 'text-red-600'
    }
  ];

  const getCategoryConfig = (kategori: any) =>
    categories.find((c) => c.value === kategori) || categories[0];

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minute ago`;
    if (hours < 24) return `${hours} hour ago`;
    if (days < 7) return `${days} day ago`;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications?.filter((n: any) => n.kategori === filter);

  const unreadCount = notifications?.filter(
    (n: any) => n.status === 'Belum Dibaca'
  ).length;

  // === LOADING STATE ===
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50'>
        <p className='animate-pulse text-gray-500'>Loading...</p>
      </div>
    );
  }

  // === ERROR STATE ===
  if (isError) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50'>
        <AlertCircle className='mb-3 h-10 w-10 text-red-500' />
        <p className='mb-4 text-gray-600'>Failed</p>
        <button
          onClick={() => refetch()}
          className='rounded-full bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
      {/* Header */}
      <div className='sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'>
        <div className='mx-auto max-w-6xl px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Bell className='h-7 w-7 text-white' />
                {unreadCount > 0 && (
                  <div className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500'>
                    <span className='text-xs font-bold text-white'>
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className='text-xl font-bold text-white'>Notification</h1>
                <p className='text-sm text-blue-100'>
                  {filteredNotifications.length} notification
                </p>
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className='relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30'
              >
                <Filter className='h-5 w-5 text-white' />
                {filter !== 'all' && (
                  <div className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-yellow-400'></div>
                )}
              </button>
              <button className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30'>
                <CheckCheck className='h-5 w-5 text-white' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Menu */}
      {showFilterMenu && (
        <div className='sticky top-16 z-30 bg-white shadow-md'>
          <div className='mx-auto max-w-6xl px-4 py-3'>
            <div className='hide-scrollbar flex gap-2 overflow-x-auto'>
              {categories.map((cat) => {
                const Icon = cat.icon;
                const count =
                  cat.value === 'all'
                    ? notifications.length
                    : notifications.filter((n: any) => n.kategori === cat.value)
                        .length;

                return (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setFilter(cat.value);
                      setShowFilterMenu(false);
                    }}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 transition-all ${
                      filter === cat.value
                        ? 'scale-105 bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    <span className='text-sm font-medium'>{cat.label}</span>
                    {count > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          filter === cat.value ? 'bg-white/30' : 'bg-gray-200'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Notification List */}
      <div className='mx-auto max-w-6xl px-4 py-4'>
        <div className='space-y-3'>
          {filteredNotifications.length === 0 ? (
            <div className='py-16 text-center'>
              <Bell className='mx-auto mb-4 h-16 w-16 text-gray-300' />
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                No data
              </h3>
              <p className='text-gray-500'>
                no data for {filter !== 'all' ? `this ${filter}` : ''}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif: any) => {
              const categoryConfig = getCategoryConfig(notif.kategori);
              const Icon = categoryConfig.icon;
              return (
                <a
                  key={notif.id}
                  href={notif.redirectSiswa}
                  className={`active:scale-98 block rounded-2xl border-l-4 bg-white p-4 shadow-md transition-all duration-200 ${
                    notif.status === 'unread'
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className='flex gap-3'>
                    <div
                      className={`h-12 w-12 flex-shrink-0 rounded-xl ${
                        notif.status === 'unread'
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      } flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${categoryConfig.color}`} />
                    </div>

                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-start justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-bold ${
                              notif.status === 'unread'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {categoryConfig.label}
                          </span>
                          {notif.status === 'unread' && (
                            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500'></div>
                          )}
                        </div>
                      </div>

                      <p
                        className={`mb-2 text-sm leading-relaxed ${
                          notif.status === 'unread'
                            ? 'font-medium text-gray-900'
                            : 'text-gray-600'
                        }`}
                      >
                        {notif.keterangan}
                      </p>

                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <span>{formatDate(notif.createdOn)}</span>
                        {notif.status === 'read' && (
                          <div className='flex items-center gap-1 text-gray-400'>
                            <Check className='h-3 w-3' />
                            <span>Dibaca</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .active\\:scale-98:active { transform: scale(0.98); }
      `}</style>

      <BottomNav />
    </div>
  );
}
