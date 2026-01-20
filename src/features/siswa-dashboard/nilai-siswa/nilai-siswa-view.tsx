'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface Nilai {
  id: string;
  nilai: number;
  jenisNilai: string;
  bobot: number;
  mapel: string;
  guru: string;
  kelas: string;
  tahunAjaran: string;
  createdOn: string;
}

import {
  TrendingUp,
  Calendar,
  Filter,
  Award,
  BarChart3,
  BookOpen,
  X,
  ChevronDown
} from 'lucide-react';

export default function NilaiSiswaView() {
  const { data: session } = useSession();

  const [search, setSearch] = useState('');
  const [filterLastWeek, setFilterLastWeek] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState<any>(null);

  const fetchNilai = async (): Promise<Nilai[]> => {
    if (!session?.user?.token) return [];
    const res = await api.get('siswa/nilai', {
      headers: { Authorization: `Bearer ${session.user.token}` }
    });
    return res.data.data;
  };

  const {
    data: nilaiSiswa = [],
    isLoading,
    error
  } = useQuery<Nilai[]>({
    queryKey: ['nilai-siswa'],
    queryFn: fetchNilai,
    enabled: !!session?.user?.token
    // staleTime: 1000 * 60 * 20
  });

  // Tangani error di return statement
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memuat data'
      );
    }
  }, [error]);

  // Dummy data

  const filteredData = nilaiSiswa.filter((n) => {
    const matchesSearch =
      n.mapel.toLowerCase().includes(search.toLowerCase()) ||
      n.guru.toLowerCase().includes(search.toLowerCase()) ||
      n.jenisNilai.toLowerCase().includes(search.toLowerCase());

    let matchesDate = true;
    if (filterLastWeek) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesDate = new Date(n.createdOn) >= sevenDaysAgo;
    }
    if (startDate && endDate) {
      const date = new Date(n.createdOn);
      matchesDate = date >= new Date(startDate) && date <= new Date(endDate);
    }
    return matchesSearch && matchesDate;
  });

  // Calculate statistics
  const avgNilai =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, n) => sum + n.nilai, 0) /
          filteredData.length
        ).toFixed(1)
      : 0;

  const maxNilai =
    filteredData.length > 0 ? Math.max(...filteredData.map((n) => n.nilai)) : 0;

  const minNilai =
    filteredData.length > 0 ? Math.min(...filteredData.map((n) => n.nilai)) : 0;

  // Group by mapel for chart
  const mapelStats: any = {};
  filteredData.forEach((n: any) => {
    if (!mapelStats[n.mapel]) {
      mapelStats[n.mapel] = { total: 0, count: 0 };
    }
    mapelStats[n.mapel].total += n.nilai;
    mapelStats[n.mapel].count += 1;
  });

  const chartData = Object.entries(mapelStats).map(([mapel, stats]: any) => ({
    mapel,
    avg: (stats.total / stats.count).toFixed(1)
  }));

  const getJenisNilaiBadge = (jenis: any) => {
    const configs: any = {
      UAS: { bg: 'bg-red-100', text: 'text-red-700' },
      UTS: { bg: 'bg-orange-100', text: 'text-orange-700' },
      Tugas: { bg: 'bg-blue-100', text: 'text-blue-700' },
      Kuis: { bg: 'bg-purple-100', text: 'text-purple-700' },
      Praktikum: { bg: 'bg-green-100', text: 'text-green-700' }
    };
    return configs[jenis] || configs['Tugas'];
  };

  const getNilaiColor = (nilai: any) => {
    if (nilai >= 85) return 'text-green-600';
    if (nilai >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
      {/* Header */}
      <NavbarSiswa title='Student Score' />
      <div className={`${process.env.NEXT_PUBLIC_THEME_COLOR} px-4 pb-24 pt-6`}>
        {/* <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-4 pb-24 pt-6'> */}
        <div className='mx-auto max-w-6xl'>
          {/* Stats Cards */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <div className='mb-2 flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-white' />
                <p className='text-xs text-blue-100'>Average</p>
              </div>
              <p className='text-2xl font-bold text-white'>{avgNilai}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <div className='mb-2 flex items-center gap-2'>
                <Award className='h-5 w-5 text-white' />
                <p className='text-xs text-blue-100'>Highest</p>
              </div>
              <p className='text-2xl font-bold text-white'>{maxNilai}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <div className='mb-2 flex items-center gap-2'>
                <BarChart3 className='h-5 w-5 text-white' />
                <p className='text-xs text-blue-100'>Lowest</p>
              </div>
              <p className='text-2xl font-bold text-white'>{minNilai}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className='relative z-10 mx-auto -mt-16 mb-6 max-w-6xl px-4'>
        <div className='rounded-2xl bg-white p-6 shadow-xl'>
          <h3 className='mb-4 flex items-center gap-2 text-lg font-bold text-gray-900'>
            <BarChart3 className='h-5 w-5 text-blue-600' />
            Average Score per Subject
          </h3>

          <div className='space-y-3'>
            {chartData.map((data: any, idx) => (
              <div key={idx} className='flex items-center gap-3'>
                <div className='w-32 truncate text-sm font-medium text-gray-700'>
                  {data.mapel}
                </div>
                <div className='relative h-8 flex-1 overflow-hidden rounded-full bg-gray-200'>
                  <div
                    className='flex h-full items-center justify-end rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-3 transition-all duration-500'
                    style={{ width: `${(data.avg / 100) * 100}%` }}
                  >
                    <span className='text-sm font-bold text-white'>
                      {data.avg}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className='mx-auto mb-6 max-w-6xl px-4'>
        <div className='rounded-2xl bg-white p-4 shadow-lg'>
          <div className='mb-3 flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search subject, teacher, or assessment type...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
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
              <Filter className='h-5 w-5' />
            </button>
          </div>

          {showFilter && (
            <div className='animate-[slideDown_0.2s_ease-out] space-y-3'>
              <button
                onClick={() => setFilterLastWeek(!filterLastWeek)}
                className={`w-full rounded-xl px-4 py-3 font-medium transition-all ${
                  filterLastWeek
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                {filterLastWeek ? '✓ Last Week' : 'Filter Last Week'}
              </button>

              <div className='grid grid-cols-2 gap-2'>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder='Dari'
                  className='rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none'
                />
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder='Sampai'
                  className='rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:outline-none'
                />
              </div>

              <button
                onClick={() => {
                  setSearch('');
                  setFilterLastWeek(false);
                  setStartDate('');
                  setEndDate('');
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
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Memuat data nilai...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className='py-12 text-center'>
            <Award className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Tidak ada data nilai
            </h3>
            <p className='text-gray-500'>Belum ada nilai yang tersedia</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {filteredData.map((nilai) => {
              const jenisBadge = getJenisNilaiBadge(nilai.jenisNilai);

              return (
                <div
                  key={nilai.id}
                  onClick={() => setSelectedMapel(nilai)}
                  className='active:scale-98 cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition-all'
                >
                  <div className='mb-3 flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-2'>
                        <BookOpen className='h-5 w-5 text-blue-600' />
                        <h3 className='text-base font-bold text-gray-900'>
                          {nilai.mapel}
                        </h3>
                      </div>
                      <p className='text-sm text-gray-600'>
                        Guru: {nilai.guru}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p
                        className={`text-3xl font-bold ${getNilaiColor(nilai.nilai)}`}
                      >
                        {nilai.nilai}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${jenisBadge.bg} ${jenisBadge.text}`}
                      >
                        {nilai.jenisNilai}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-600'>
                    <div className='flex items-center gap-4'>
                      <span>Class: {nilai.kelas}</span>
                      <span>Weight score: {nilai.bobot}%</span>
                    </div>

                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      <span>
                        {new Date(nilai.createdOn).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedMapel && (
        <div className='fixed inset-0 z-50 animate-[fadeIn_0.2s_ease-out]'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setSelectedMapel(null)}
          ></div>

          <div
            style={{
              transform: 'translateY(-70px)' // 🔹 Naik sedikit (sekitar 20px)
            }}
            className='absolute inset-x-0 bottom-0 animate-[slideUp_0.3s_ease-out] p-4 md:inset-0 md:flex md:items-center md:justify-center'
          >
            <div className='relative w-full max-w-2xl rounded-t-3xl bg-white shadow-2xl md:rounded-3xl'>
              <div className='rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 md:rounded-t-3xl'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='mb-1 text-xl font-bold text-white'>
                      {selectedMapel.mapel}
                    </h2>
                    <p className='text-sm text-blue-100'>Detail Penilaian</p>
                  </div>
                  <button
                    onClick={() => setSelectedMapel(null)}
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 active:bg-white/30'
                  >
                    <X className='h-6 w-6 text-white' />
                  </button>
                </div>
              </div>

              <div className='space-y-4 p-6'>
                <div className='flex items-center justify-between rounded-xl bg-blue-50 p-4'>
                  <span className='font-medium text-gray-700'>Nilai</span>
                  <span
                    className={`text-3xl font-bold ${getNilaiColor(selectedMapel.nilai)}`}
                  >
                    {selectedMapel.nilai}
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='rounded-xl bg-gray-50 p-4'>
                    <p className='mb-1 text-sm text-gray-600'>Jenis Nilai</p>
                    <p className='font-bold text-gray-900'>
                      {selectedMapel.jenisNilai}
                    </p>
                  </div>
                  <div className='rounded-xl bg-gray-50 p-4'>
                    <p className='mb-1 text-sm text-gray-600'>Bobot</p>
                    <p className='font-bold text-gray-900'>
                      {selectedMapel.bobot}%
                    </p>
                  </div>
                  <div className='rounded-xl bg-gray-50 p-4'>
                    <p className='mb-1 text-sm text-gray-600'>Kelas</p>
                    <p className='font-bold text-gray-900'>
                      {selectedMapel.kelas}
                    </p>
                  </div>
                  <div className='rounded-xl bg-gray-50 p-4'>
                    <p className='mb-1 text-sm text-gray-600'>Tahun Ajaran</p>
                    <p className='font-bold text-gray-900'>
                      {selectedMapel.tahunAjaran}
                    </p>
                  </div>
                </div>

                <div className='rounded-xl bg-gray-50 p-4'>
                  <p className='mb-1 text-sm text-gray-600'>Guru Pengajar</p>
                  <p className='font-bold text-gray-900'>
                    {selectedMapel.guru}
                  </p>
                </div>

                <div className='rounded-xl bg-gray-50 p-4'>
                  <p className='mb-1 text-sm text-gray-600'>Tanggal Input</p>
                  <p className='font-bold text-gray-900'>
                    {new Date(selectedMapel.createdOn).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }
                    )}
                  </p>
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
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
      <BottomNav />
    </div>
  );
}
