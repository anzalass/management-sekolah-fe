'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

import {
  CalendarIcon,
  Timer,
  Book,
  XCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  SearchIcon
} from 'lucide-react';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import HeaderSiswa from '../header-siswa';
import BottomNav from '../bottom-nav';
import FilterMobileLogPresensi from './filter-mobile-presensi';
import EmptyState from '../empty-state';

interface Presensi {
  id: number;
  waktu: string; // ISO string
  keterangan: 'Hadir' | 'Sakit' | 'Izin' | 'Alpha';
  lokasi?: string;
  catatan?: string;
}

export default function LogPresensiView() {
  const { data: session } = useSession();

  // filters / ui state
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState(''); // yyyy-mm-dd
  const [filterBulan, setFilterBulan] = useState(''); // '01'..'12'
  const [filterTahun, setFilterTahun] = useState(''); // yyyy
  const [filterKeterangan, setFilterKeterangan] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // fetch presensi
  const {
    data: presensi = [],
    isLoading,
    error
  } = useQuery<Presensi[]>({
    queryKey: ['presensi-siswa'],
    queryFn: async () => {
      if (!session?.user?.token) return [];
      const res = await api.get('siswa/presensi', {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
      return res.data.data as Presensi[];
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 2 // 2 menit
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

  // helper: available tahun dari data
  const tahunList = useMemo(() => {
    const setT = new Set<string>();
    presensi.forEach((p) => {
      try {
        const y = new Date(p.waktu).getFullYear().toString();
        setT.add(y);
      } catch {
        // ignore
      }
    });
    return Array.from(setT).sort((a, b) => Number(b) - Number(a));
  }, [presensi]);

  // filtering logic (search + tanggal + bulan + tahun + keterangan)
  const filtered = presensi
    .filter((p) => {
      if (!search) return true;
      const hay = p.catatan
        ? `${p.catatan} ${p.lokasi ?? ''}`.toLowerCase()
        : '';
      // also check ISO date string and keterangan
      return (
        p.keterangan.toLowerCase().includes(search.toLowerCase()) ||
        hay.includes(search.toLowerCase())
      );
    })
    .filter((p) => {
      if (!filterTanggal) return true;
      const dateOnly = new Date(p.waktu).toISOString().split('T')[0];
      return dateOnly === filterTanggal;
    })
    .filter((p) => {
      if (!filterBulan) return true;
      const month = String(new Date(p.waktu).getMonth() + 1).padStart(2, '0');
      return month === filterBulan;
    })
    .filter((p) => {
      if (!filterTahun) return true;
      const year = String(new Date(p.waktu).getFullYear());
      return year === filterTahun;
    })
    .filter((p) => {
      if (!filterKeterangan) return true;
      return p.keterangan === filterKeterangan;
    });

  // summary stats
  const summary = filtered.reduce(
    (acc, item) => {
      if (item.keterangan === 'Hadir') acc.hadir++;
      if (item.keterangan === 'Sakit') acc.sakit++;
      if (item.keterangan === 'Izin') acc.izin++;
      if (item.keterangan === 'Alpha') acc.alpha++;
      return acc;
    },
    { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
  );

  const totalCount = filtered.length;

  const resetFilters = () => {
    setSearch('');
    setFilterTanggal('');
    setFilterBulan('');
    setFilterTahun('');
    setFilterKeterangan('');
  };

  const formatDateFull = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

  // card style helper
  const getStyleFor = (k: Presensi['keterangan']) => {
    switch (k) {
      case 'Hadir':
        return {
          gradient: 'from-green-500 to-emerald-500',
          badgeBg: 'bg-green-100',
          badgeText: 'text-green-700',
          iconColor: 'text-green-600'
        };
      case 'Sakit':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          badgeBg: 'bg-blue-100',
          badgeText: 'text-blue-700',
          iconColor: 'text-blue-600'
        };
      case 'Izin':
        return {
          gradient: 'from-yellow-500 to-amber-500',
          badgeBg: 'bg-yellow-100',
          badgeText: 'text-yellow-700',
          iconColor: 'text-yellow-600'
        };
      case 'Alpha':
      default:
        return {
          gradient: 'from-red-500 to-rose-500',
          badgeBg: 'bg-red-100',
          badgeText: 'text-red-700',
          iconColor: 'text-red-600'
        };
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 pb-20'>
      {/* HEADER with blue theme + stats */}
      <div className='bg-blue-800 px-4 pb-24 pt-6'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-6 flex items-center gap-3'>
            <Link
              href={'/siswa'}
              className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'
            >
              <ArrowIcon />
            </Link>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'>
              <Book />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-white'>Log Presensi</h1>
              <p className='text-sm text-blue-100'>Riwayat kehadiran siswa</p>
            </div>
          </div>

          {/* stats small cards */}
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <div className='mb-2 flex items-center gap-2'>
                <TrendingUpIcon />
                <p className='text-xs text-blue-100'>Total</p>
              </div>
              <p className='text-2xl font-bold text-white'>{totalCount}</p>
            </div>

            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='mb-2 text-xs text-blue-100'>Hadir</p>
              <p className='text-2xl font-bold text-white'>{summary.hadir}</p>
            </div>

            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='mb-2 text-xs text-blue-100'>Sakit</p>
              <p className='text-2xl font-bold text-white'>{summary.sakit}</p>
            </div>

            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='mb-2 text-xs text-blue-100'>Izin</p>
              <p className='text-2xl font-bold text-white'>{summary.izin}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER (card below header) */}
      <div className='mx-auto -mt-16 max-w-6xl px-4'>
        <div className='rounded-2xl bg-white p-4 shadow-xl'>
          <div className='mb-3 flex gap-2'>
            <div className='relative flex-1'>
              <SearchIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Cari Keterangan'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='h-[47px] w-full pl-10'
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
              <FilterIcon />
            </button>
          </div>

          {showFilter && (
            <div className='animate-[slideDown_0.2s_ease-out] space-y-3'>
              <div className='grid gap-3 sm:grid-cols-4'>
                <div className='relative'>
                  <CalendarIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <Input
                    type='date'
                    value={filterTanggal}
                    onChange={(e) => setFilterTanggal(e.target.value)}
                    className='h-11 rounded-xl border-gray-200 pl-10'
                  />
                </div>

                <Select
                  value={filterBulan || 'all'}
                  onValueChange={(v) => setFilterBulan(v === 'all' ? '' : v)}
                >
                  <SelectTrigger className='h-11 rounded-xl'>
                    <SelectValue placeholder='Bulan' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua Bulan</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => {
                      const bulan = (i + 1).toString().padStart(2, '0');
                      const namaBulan = new Date(2000, i).toLocaleString(
                        'id-ID',
                        { month: 'long' }
                      );
                      return (
                        <SelectItem key={bulan} value={bulan}>
                          {namaBulan}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select
                  value={filterTahun || 'all'}
                  onValueChange={(v) => setFilterTahun(v === 'all' ? '' : v)}
                >
                  <SelectTrigger className='h-11 rounded-xl'>
                    <SelectValue placeholder='Tahun' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua Tahun</SelectItem>
                    {tahunList.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterKeterangan || 'all'}
                  onValueChange={(v) =>
                    setFilterKeterangan(v === 'all' ? '' : v)
                  }
                >
                  <SelectTrigger className='h-11 rounded-xl'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua</SelectItem>
                    <SelectItem value='Hadir'>Hadir</SelectItem>
                    <SelectItem value='Sakit'>Sakit</SelectItem>
                    <SelectItem value='Izin'>Izin</SelectItem>
                    <SelectItem value='Alpha'>Alpha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={resetFilters}
                  className='rounded-xl'
                >
                  <XCircle className='mr-2 h-4 w-4' />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className='mx-auto max-w-6xl px-4 py-8'>
        {isLoading ? (
          <div className='py-12 text-center'>
            <Loader2 className='mx-auto h-12 w-12 animate-spin text-blue-600' />
            <p className='mt-4 text-gray-600'>Memuat data presensi...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className='py-12 text-center'>
            <EmptyState
              title={
                filterTanggal || filterBulan || filterTahun || filterKeterangan
                  ? 'Tidak ada data yang sesuai filter'
                  : 'Belum ada riwayat presensi'
              }
              description={
                filterTanggal || filterBulan || filterTahun || filterKeterangan
                  ? 'Coba reset filter'
                  : 'Presensi belum tercatat'
              }
            />
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {filtered.map((item) => {
              const style = getStyleFor(item.keterangan);
              return (
                <Card
                  key={item.id}
                  className='group overflow-hidden border-0 shadow-md'
                >
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${style.gradient}`}
                  />

                  <CardHeader className='pb-7'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm'>
                          <Clock className={`h-6 w-6 ${style.iconColor}`} />
                        </div>

                        <div className='min-w-0'>
                          <div className='mb-1 flex items-center gap-2'>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-bold ${style.badgeBg} ${style.badgeText}`}
                            >
                              {item.keterangan}
                            </span>
                          </div>

                          <CardTitle className='mt-2 text-sm font-bold text-gray-900'>
                            {formatDateFull(item.waktu)}
                          </CardTitle>
                        </div>
                      </div>

                      <div className='flex-shrink-0 text-right'>
                        <p className='text-2xl font-bold text-gray-900'>
                          {formatTime(item.waktu)}
                        </p>
                        <p className='text-xs text-muted-foreground'>Waktu</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Small helper icons as inline components to avoid extra imports ---------- */
function ArrowIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      className='text-white'
    >
      <path
        d='M15 18l-6-6 6-6'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
function TrendingUpIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      className='text-white'
    >
      <path
        d='M3 17l6-6 4 4 8-8'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      className='text-inherit'
    >
      <path
        d='M4 6h16M6 12h12M10 18h4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
