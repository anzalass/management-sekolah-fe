'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  CalendarIcon,
  ChevronRight,
  Clock,
  Megaphone,
  Search,
  SearchIcon,
  X,
  XCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import FilterMobile from './filter-pengumuman-mobile';
import Loading from '../loading';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Pengumuman {
  id: number;
  title: string;
  content: string;
  time: string;
}

export default function PengumumanView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [selectedPengumuman, setSelectedPengumuman] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: any) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stripHtml = (html: any) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const {
    data: pengumuman = [],
    isLoading,
    error
  } = useQuery<Pengumuman[]>({
    queryKey: ['pengumuman-siswa'],
    queryFn: async () => {
      if (!session?.user?.token) return [];
      const res = await api.get('siswa/pengumuman', {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memuat data'
      );
    }
  }, [error]);

  const filteredPengumuman = pengumuman
    .filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      if (!filterTanggal) return true;
      const dateOnly = new Date(item.time).toISOString().split('T')[0];
      return dateOnly === filterTanggal;
    });

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
      {/* Header */}
      <div className='w-full bg-blue-800'>
        <div className='mx-auto max-w-6xl'>
          <NavbarSiswa title='Announcment' />
        </div>
      </div>
      <div className='bg-blue-800 px-4 pb-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='flex items-center justify-center gap-3'>
            <div>
              <p className='text-sm text-blue-100'>
                {filteredPengumuman.length} Announcment Available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className='relative z-10 mx-auto -mt-4 mb-6 max-w-6xl px-4'>
        <div className='rounded-2xl bg-white p-4 shadow-xl'>
          <div className='mb-3 flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Find title or content...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                showFilter
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <Calendar className='h-5 w-5' />
            </button>
          </div>

          {/* Date Filter */}
          {showFilter && (
            <div className='animate-[slideDown_0.2s_ease-out]'>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <input
                  type='date'
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none'
                />
              </div>
              <Button
                onClick={() => setFilterTanggal('')}
                variant='outline'
                className='mt-2 rounded-xl px-4'
              >
                <XCircle className='mr-2 h-4 w-4' />
                Reset
              </Button>{' '}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-6xl px-4'>
        {isLoading ? (
          <div className='py-12 text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Loading data...</p>
          </div>
        ) : filteredPengumuman.length === 0 ? (
          <div className='py-12 text-center'>
            <Megaphone className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              No data.
            </h3>
            <p className='text-gray-500'>Nothing Announcment Available</p>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {filteredPengumuman.map((item: any) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedPengumuman(item);
                  setIsDialogOpen(true);
                }}
                className='active:scale-98 cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition-all hover:shadow-xl'
              >
                {/* Title */}
                <div className='mb-3 flex items-start justify-between gap-3'>
                  <h3 className='flex-1 text-base font-bold leading-tight text-gray-900'>
                    {item.title}
                  </h3>
                  <ChevronRight className='h-5 w-5 flex-shrink-0 text-gray-400' />
                </div>

                {/* Content Preview */}
                <p className='mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600'>
                  {stripHtml(item.content)}
                </p>

                {/* Date */}
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Clock className='h-4 w-4' />
                  <span>
                    {formatDate(item.time)} • {formatTime(item.time)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {isDialogOpen && selectedPengumuman && (
        <div className='fixed inset-0 z-50 animate-[fadeIn_0.2s_ease-out]'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsDialogOpen(false)}
          ></div>

          {/* Modal Content */}
          <div
            className='absolute inset-x-0 bottom-0 animate-[slideUp_0.3s_ease-out] p-4 md:inset-0 md:flex md:items-center md:justify-center'
            style={{
              transform: 'translateY(-70px)' // 🔹 Naik sedikit (sekitar 20px)
            }}
          >
            <div className='relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-2xl md:rounded-3xl'>
              {/* Header */}
              <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5'>
                <div className='flex items-start justify-between gap-3'>
                  <h2 className='flex-1 text-xl font-bold leading-tight text-white'>
                    {selectedPengumuman?.title}
                  </h2>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30'
                  >
                    <X className='h-6 w-6 text-white' />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div
                className='overflow-y-auto p-6'
                style={{ maxHeight: 'calc(90vh - 160px)' }}
              >
                <div
                  className='prose prose-sm mb-6 max-w-none text-gray-700'
                  dangerouslySetInnerHTML={{
                    __html: selectedPengumuman?.content
                  }}
                />

                {/* Date Info */}
                <div className='border-t border-gray-200 pt-4'>
                  <div className='flex items-center gap-3 text-sm text-gray-600'>
                    <Clock className='h-5 w-5' />
                    <div>
                      <p className='font-medium text-gray-900'>Time Release</p>
                      <p>
                        {formatDate(selectedPengumuman?.time)} •{' '}
                        {formatTime(selectedPengumuman?.time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .active\:scale-98:active {
          transform: scale(0.98);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .prose p {
          margin-bottom: 1em;
        }
        .prose ul {
          margin: 1em 0;
          padding-left: 1.5em;
        }
        .prose li {
          margin-bottom: 0.5em;
        }
      `}</style>
      <BottomNav />
    </div>
  );
}
