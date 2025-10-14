'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  Calendar,
  CalendarIcon,
  Filter,
  Search,
  SearchIcon,
  TrendingUp
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';
import FilterMobilePelanggaran from './pelanggaran-filter-mobile';
import { useQuery } from '@tanstack/react-query';
import EmptyState from '../empty-state';
import Loading from '../loading';
import Link from 'next/link';

export default function PelanggaranView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // React Query Fetcher
  const fetchPelanggaran = async () => {
    const res = await api.get('siswa/pelanggaran', {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`
      }
    });
    return res.data.data;
  };

  const {
    data: pelanggaran = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['pelanggaran', session?.user?.token],
    queryFn: fetchPelanggaran,
    enabled: !!session?.user?.token // fetch hanya kalau token ada
  });

  if (isError) {
    toast.error((error as any)?.response?.data?.message || 'Terjadi kesalahan');
  }

  const filtered = pelanggaran
    .filter((p: any) =>
      p.keterangan.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p: any) => !filterTanggal || p.waktu.startsWith(filterTanggal))
    .filter((p: any) => {
      if (!filterJenis) return true;
      if (filterJenis === 'Berat') return p.poin > 70;
      if (filterJenis === 'Sedang') return p.poin > 25 && p.poin <= 70;
      if (filterJenis === 'Ringan') return p.poin <= 25;
      return true;
    });

  // Statistics
  const totalPoin = filtered.reduce((sum: any, p: any) => sum + p.poin, 0);
  const totalBerat = filtered.filter((p: any) => p.poin > 70).length;
  const totalSedang = filtered.filter(
    (p: any) => p.poin > 25 && p.poin <= 70
  ).length;
  const totalRingan = filtered.filter((p: any) => p.poin <= 25).length;

  const getViolationConfig = (poin: any) => {
    if (poin > 70) {
      return {
        label: 'Berat',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-500',
        gradient: 'from-red-500 to-pink-500',
        icon: AlertTriangle
      };
    }
    if (poin > 25) {
      return {
        label: 'Sedang',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-500',
        gradient: 'from-yellow-500 to-orange-500',
        icon: AlertCircle
      };
    }
    return {
      label: 'Ringan',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-500',
      gradient: 'from-green-500 to-emerald-500',
      icon: AlertCircle
    };
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-red-50 pb-20'>
      {/* Header */}
      <div className='bg-blue-800 px-4 pb-24 pt-6'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-6 flex items-center gap-3'>
            <Link
              href='/siswa'
              className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'
            >
              <ArrowLeft className='h-7 w-7 text-white' />
            </Link>
            <div className='flex h-12 w-12 items-center justify-center space-x-3 rounded-full bg-white/20'>
              <AlertTriangle className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-base font-bold text-white lg:text-2xl'>
                Student Violation
              </h1>
              <p className='text-sm text-red-100'>
                Records of violations and penalties
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <div className='mb-2 flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-white' />
                <p className='text-xs text-red-100'>Total Point</p>
              </div>
              <p className='text-2xl font-bold text-white'>{totalPoin}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='mb-2 text-xs text-red-100'>High</p>
              <p className='text-2xl font-bold text-white'>{totalBerat}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='mb-2 text-xs text-red-100'>Medium</p>
              <p className='text-2xl font-bold text-white'>{totalSedang}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='mb-2 text-xs text-red-100'>Low</p>
              <p className='text-2xl font-bold text-white'>{totalRingan}</p>
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
                placeholder='Find description...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100'
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                showFilter
                  ? 'bg-red-600 text-white'
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
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-red-500 focus:outline-none'
                />
              </div>

              <div className='grid grid-cols-3 gap-2'>
                {['Ringan', 'Sedang', 'Berat'].map((jenis) => (
                  <button
                    key={jenis}
                    onClick={() =>
                      setFilterJenis(filterJenis === jenis ? '' : jenis)
                    }
                    className={`rounded-xl px-4 py-3 font-medium transition-all ${
                      filterJenis === jenis
                        ? jenis === 'Berat'
                          ? 'bg-red-600 text-white'
                          : jenis === 'Sedang'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    {jenis}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setSearch('');
                  setFilterTanggal('');
                  setFilterJenis('');
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
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Loading data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className='py-12 text-center'>
            <Award className='mx-auto mb-4 h-16 w-16 text-green-500' />
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              No data!
            </h3>
            <p className='text-gray-500'>Youre a kind people 🎉</p>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {filtered.map((violation: any, idx: any) => {
              const config = getViolationConfig(violation.poin);
              const Icon = config.icon;

              return (
                <div
                  key={violation.id}
                  className={`rounded-2xl border-l-4 bg-white p-5 shadow-md ${config.borderColor} active:scale-98 transition-all`}
                >
                  <div className='mb-4 flex items-start justify-between gap-3'>
                    <div className='flex flex-1 items-start gap-3'>
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${config.gradient} flex flex-shrink-0 items-center justify-center`}
                      >
                        <Icon className='h-6 w-6 text-white' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='mb-1 flex items-center gap-2'>
                          <span className='text-xs font-semibold text-gray-500'>
                            #{idx + 1}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-bold ${config.bgColor} ${config.textColor}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className='text-sm font-bold leading-tight text-gray-900'>
                          {violation.keterangan}
                        </p>
                      </div>
                    </div>
                    <div className='flex-shrink-0 text-right'>
                      <p className={`text-2xl font-bold ${config.textColor}`}>
                        {violation.poin}
                      </p>
                      <p className='text-xs text-gray-500'>poin</p>
                    </div>
                  </div>

                  <div className='mb-4 space-y-2'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <Calendar className='h-4 w-4' />
                      <span>{formatDate(violation.waktu)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      {filtered.length > 0 && (
        <div className='mx-auto mt-8 max-w-6xl px-4'>
          <div className='rounded-2xl border border-blue-200 bg-blue-50 p-6'>
            <div className='flex items-start gap-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600'>
                <AlertCircle className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='mb-2 text-lg font-bold text-blue-900'>
                  Violation Point Information
                </h3>
                <ul className='space-y-1 text-sm text-blue-800'>
                  <li>
                    • <strong>Minor (1–25 points):</strong> Verbal/Written
                    warning
                  </li>
                  <li>
                    • <strong>Moderate (26–70 points):</strong> Parent meeting
                  </li>
                  <li>
                    • <strong>Severe ({'>'}70 points):</strong>{' '}
                    Suspension/serious action
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
      <BottomNav />
    </div>
  );
}
