'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Award,
  Calendar,
  Filter,
  Search,
  Sparkles,
  Star,
  Trophy
} from 'lucide-react';
import BottomNav from '../bottom-nav';

export default function PrestasiView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // 🔹 Fetch Prestasi
  const fetchPrestasi = async () => {
    const res = await api.get('siswa/prestasi', {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`
      }
    });
    return res.data.data;
  };

  const {
    data: prestasi = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['prestasi-siswa', session?.user?.token],
    queryFn: fetchPrestasi,
    enabled: !!session?.user?.token
  });

  if (isError) {
    toast.error((error as any)?.response?.data?.message || 'Terjadi kesalahan');
  }

  // 🔹 Filter Data
  const filtered = prestasi
    .filter((p: any) =>
      p.keterangan.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p: any) => !filterTanggal || p.waktu.startsWith(filterTanggal));

  // 🔹 Statistik
  const totalPrestasi = filtered.length;
  const tahunIni = filtered.filter(
    (p: any) => new Date(p.waktu).getFullYear() === new Date().getFullYear()
  ).length;
  const bulanIni = filtered.filter(
    (p: any) =>
      new Date(p.waktu).getMonth() === new Date().getMonth() &&
      new Date(p.waktu).getFullYear() === new Date().getFullYear()
  ).length;

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 pb-20'>
      {/* Header */}
      <div className={`${process.env.NEXT_PUBLIC_THEME_COLOR} px-4 pb-24 pt-6`}>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-6 flex items-center gap-3'>
            <Link
              href='/siswa'
              className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'
            >
              <ArrowLeft className='h-7 w-7 text-white' />
            </Link>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'>
              <Trophy className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-base font-bold text-white lg:text-2xl'>
                Achivement Student
              </h1>
              <p className='text-sm text-yellow-100'>
                Your records achivement so far
              </p>
            </div>
          </div>

          {/* Statistik */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='text-xs text-yellow-100'>Total Achivement</p>
              <p className='text-2xl font-bold text-white'>{totalPrestasi}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='text-xs text-yellow-100'>This Year</p>
              <p className='text-2xl font-bold text-white'>{tahunIni}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='text-xs text-yellow-100'>This Month</p>
              <p className='text-2xl font-bold text-white'>{bulanIni}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className='relative z-10 mx-auto -mt-16 mb-6 max-w-6xl px-4'>
        <div className='rounded-2xl bg-white p-4 shadow-xl'>
          <div className='mb-3 flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Find achivement...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-100'
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                showFilter
                  ? 'bg-yellow-500 text-white'
                  : 'border border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <Filter className='h-5 w-5' />
            </button>
          </div>

          {showFilter && (
            <div className='animate-[slideDown_0.2s_ease-out] space-y-3'>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <input
                  type='date'
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-yellow-500 focus:outline-none'
                />
              </div>

              <button
                onClick={() => {
                  setSearch('');
                  setFilterTanggal('');
                }}
                className='w-full rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 active:bg-gray-200'
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-6xl px-4'>
        {isLoading ? (
          <div className='py-12 text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Loading data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className='py-12 text-center'>
            <Award className='mx-auto mb-4 h-16 w-16 text-yellow-500' />
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              No data
            </h3>
            <p className='text-gray-500'>Dont give up! 🏆</p>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {filtered.map((p: any, i: number) => (
              <div
                key={p.id}
                className='active:scale-98 rounded-2xl border-l-4 border-yellow-500 bg-white p-5 shadow-md transition-all'
              >
                <div className='mb-4 flex items-start justify-between gap-3'>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400'>
                      <Star className='h-6 w-6 text-white' />
                    </div>
                    <div>
                      <p className='text-sm font-bold text-gray-900'>
                        {p.keterangan}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatDate(p.waktu)}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <Sparkles className='mx-auto mb-1 h-5 w-5 text-yellow-500' />
                    <p className='text-xs font-medium text-yellow-600'>
                      #{i + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>

      <BottomNav />
    </div>
  );
}
