'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Search,
  Calendar,
  Filter,
  X,
  User,
  Clock,
  Heart,
  Brain,
  Users,
  Info,
  ArrowLeft
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import BottomNav from '../bottom-nav';

export default function KonselingPage() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedKonseling, setSelectedKonseling] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Fetch data konseling pakai React Query
  const {
    data: konselingData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['konseling-siswa', token],
    queryFn: async () => {
      const res = await api.get('konseling-siswa', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data.data;
    },
    enabled: !!token
  });

  const filtered =
    konselingData?.filter((k: any) => {
      const matchSearch =
        k.keterangan.toLowerCase().includes(search.toLowerCase()) ||
        k.kategori.toLowerCase().includes(search.toLowerCase());
      const matchDate = !filterDate || k.tanggal.startsWith(filterDate);
      return matchSearch && matchDate;
    }) || [];

  const getCategoryConfig = (kategori: any) => {
    const configs: any = {
      Akademik: {
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: Brain
      },
      Sosial: {
        color: 'from-green-500 to-emerald-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: Users
      },
      Keluarga: {
        color: 'from-pink-500 to-rose-500',
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        icon: Heart
      },
      Karir: {
        color: 'from-purple-500 to-indigo-500',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        icon: MessageCircle
      }
    };
    return configs[kategori] || configs['Akademik'];
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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20'>
      {/* Header */}
      <div className={`${process.env.NEXT_PUBLIC_THEME_COLOR} px-4 pb-24 pt-6`}>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-6 flex items-center gap-3'>
            <Link
              href={'/siswa'}
              className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'
            >
              <ArrowLeft className='h-7 w-7 text-white' />
            </Link>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'>
              <MessageCircle className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-base font-bold text-white lg:text-2xl'>
                Riwayat Konseling
              </h1>
              <p className='text-sm text-teal-100'>
                Catatan bimbingan & konseling
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className=''>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='text-2xl font-bold text-white'>
                {konselingData?.length || 0}
              </p>
              <p className='text-xs text-teal-100'>Total Sesi</p>
            </div>
            {/* <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='text-xs text-teal-100'>Selesai</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <p className='text-xs text-teal-100'>Terjadwal</p>
            </div> */}
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
                placeholder='Cari keterangan atau kategori...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100'
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                showFilter
                  ? 'bg-teal-600 text-white'
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
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-teal-500 focus:outline-none'
                />
              </div>
              <button
                onClick={() => {
                  setSearch('');
                  setFilterDate('');
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
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Memuat data konseling...</p>
          </div>
        ) : isError ? (
          <div className='py-12 text-center text-red-500'>
            Terjadi kesalahan saat memuat data.
          </div>
        ) : filtered.length === 0 ? (
          <div className='py-12 text-center'>
            <MessageCircle className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Tidak ada data konseling
            </h3>
            <p className='text-gray-500'>
              Belum ada sesi konseling yang tercatat
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filtered.map((konseling: any, idx: number) => {
              const config = getCategoryConfig(konseling.kategori);
              const Icon = config.icon;

              return (
                <div
                  key={konseling.id}
                  className='overflow-hidden rounded-2xl border-l-4 border-teal-500 bg-white shadow-lg transition-all duration-300 hover:shadow-xl'
                >
                  <div className='p-6'>
                    <div className='mb-4 flex items-start justify-between gap-4'>
                      <div className='flex flex-1 items-start gap-4'>
                        <div
                          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${config.color} flex flex-shrink-0 items-center justify-center shadow-lg`}
                        >
                          <Icon className='h-7 w-7 text-white' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${config.bg} ${config.text}`}
                          >
                            {konseling.kategori}
                          </span>
                          <h3 className='mt-2 text-lg font-bold text-gray-900'>
                            Sesi Konseling #{idx + 1}
                          </h3>
                          <p className='mb-3 line-clamp-2 text-sm text-gray-600'>
                            {konseling.keterangan}
                          </p>
                          <button
                            onClick={() => {
                              setSelectedKonseling(konseling);
                              setIsModalOpen(true);
                            }}
                            className='flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700'
                          >
                            Lihat Detail →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <User className='h-4 w-4' />
                        <span>NIS: {konseling.nisSiswa}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Clock className='h-4 w-4' />
                        <span>{formatDate(konseling.tanggal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedKonseling && (
        <div className='fixed inset-0 z-50 animate-[fadeIn_0.2s_ease-out]'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div
            style={{
              transform: 'translateY(-70px)' // 🔹 Naik sedikit (sekitar 20px)
            }}
            className='absolute inset-x-0 bottom-0 animate-[slideUp_0.3s_ease-out] p-4 md:inset-0 md:flex md:items-center md:justify-center'
          >
            <div className='relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-2xl md:rounded-3xl'>
              <div
                className={`bg-gradient-to-r ${getCategoryConfig(selectedKonseling.kategori).color} px-6 py-5`}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white'>
                      Detail Konseling
                    </h2>
                    <p className='mt-1 text-white/80'>
                      {selectedKonseling.kategori}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30'
                  >
                    <X className='h-6 w-6 text-white' />
                  </button>
                </div>
              </div>

              <div
                className='overflow-y-auto p-6'
                style={{ maxHeight: 'calc(90vh - 180px)' }}
              >
                <div className='space-y-4'>
                  <div>
                    <h3 className='mb-2 text-sm font-semibold text-gray-500'>
                      Keterangan Lengkap
                    </h3>
                    <p className='leading-relaxed text-gray-700'>
                      {selectedKonseling.keterangan}
                    </p>
                  </div>

                  <div className='space-y-3 border-t border-gray-200 pt-4'>
                    <div className='flex items-center gap-3'>
                      <User className='h-5 w-5 text-gray-400' />
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          Siswa
                        </p>
                        <p className='text-sm text-gray-600'>
                          {selectedKonseling.namaSiswa} (NIS:{' '}
                          {selectedKonseling.nisSiswa})
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Clock className='h-5 w-5 text-gray-400' />
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          Waktu
                        </p>
                        <p className='text-sm text-gray-600'>
                          {formatDate(selectedKonseling.tanggal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
