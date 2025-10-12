'use client';
import { useState } from 'react';
import {
  BookOpen,
  Search,
  Calendar,
  Filter,
  X,
  User,
  Clock,
  TrendingUp,
  Award,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import Link from 'next/link';

export default function StudentProgressNotesPage() {
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');

  const { data: session } = useSession();
  const token = session?.user?.token;

  // === FETCH DATA FROM API ===
  const {
    data: progressNotesData = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['catatan-siswa-role-siswa'],
    queryFn: async () => {
      const res = await api.get('catatan-siswaa', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data; // pastikan backend return dalam bentuk { data: [...] }
    },
    enabled: !!token // hanya jalan kalau token sudah ada
  });

  console.log(progressNotesData);

  const filtered = progressNotesData.filter((note: any) => {
    const matchSearch =
      note.content?.toLowerCase().includes(search.toLowerCase()) ||
      note.penulis?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !filterDate || note.time?.startsWith(filterDate);
    const matchCategory = !filterCategory || note.kategori === filterCategory;
    return matchSearch && matchDate && matchCategory;
  });

  const getCategoryConfig = (kategori: any) => {
    const configs: any = {
      Academic: {
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: BookOpen
      },
      'Social Emotional': {
        color: 'from-pink-500 to-rose-500',
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        icon: Heart
      },
      Extracurricular: {
        color: 'from-green-500 to-emerald-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: Award
      },
      Behavior: {
        color: 'from-orange-500 to-amber-500',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        icon: User
      }
    };
    return configs[kategori] || configs['Akademik'];
  };

  const formatDate = (dateString: any) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const stripHtml = (html: any) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (isError)
    return (
      <div className='flex min-h-screen items-center justify-center text-red-500'>
        Gagal memuat catatan siswa.
      </div>
    );

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 pb-20'>
      {/* Header */}
      <div className='bg-gradient-to-r from-indigo-600 to-purple-600 px-4 pb-8 pt-6'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-4 flex items-center gap-3'>
            <Link
              href='/siswa'
              className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'
            >
              <ArrowLeft className='h-7 w-7 text-white' />
            </Link>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'>
              <TrendingUp className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-base font-bold text-white lg:text-2xl'>
                Catatan Perkembangan
              </h1>
              <p className='text-sm text-indigo-100'>
                Progress & feedback dari guru
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-4 gap-3'>
            {[
              'Academic',
              'Social Emotional',
              'Extracurricular',
              'Behavior'
            ].map((cat) => {
              const count = progressNotesData.filter(
                (n: any) => n.kategori === cat
              ).length;
              return (
                <div
                  key={cat}
                  className='rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md'
                >
                  <p className='text-lg font-bold text-white'>{count}</p>
                  <p className='truncate text-xs text-indigo-100'>{cat}</p>
                </div>
              );
            })}
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
                placeholder='Cari catatan...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100'
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                showFilter
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <Filter className='h-5 w-5' />
            </button>
          </div>

          {showFilter && (
            <div className='animate-[slideDown_0.2s_ease-out] space-y-3'>
              {/* Filter tanggal */}
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <input
                  type='date'
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-indigo-500 focus:outline-none'
                />
              </div>

              {/* Filter kategori */}
              <div className='relative'>
                <Filter className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <select
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className='w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-indigo-500 focus:outline-none'
                  defaultValue=''
                >
                  <option value=''>Semua Kategori</option>
                  <option value='Academic'>Academic</option>
                  <option value='Social Emotional'>Social Emotional</option>
                  <option value='Extracurricular'>Extracurricular</option>
                  <option value='Behavior'>Behavior</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearch('');
                  setFilterDate('');
                  setFilterCategory('');
                }}
                className='w-full rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 active:bg-gray-200'
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className='mx-auto max-w-6xl px-4'>
        {isLoading ? (
          <div className='py-12 text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Memuat catatan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className='py-12 text-center'>
            <BookOpen className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Tidak ada catatan
            </h3>
            <p className='text-gray-500'>Belum ada catatan perkembangan</p>
          </div>
        ) : (
          <div className='relative'>
            <div className='absolute bottom-0 left-8 top-0 hidden w-0.5 bg-gradient-to-b from-indigo-200 to-purple-200 md:block'></div>

            <div className='space-y-6'>
              {filtered.map((note: any) => {
                const config = getCategoryConfig(note.kategori);
                const Icon = config.icon;

                return (
                  <div key={note.id} className='relative'>
                    <div className='absolute left-8 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-indigo-600 bg-white md:flex'></div>
                    <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl md:ml-16'>
                      <div
                        className={`bg-gradient-to-r ${config.color} flex items-center justify-between px-6 py-4`}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20'>
                            <Icon className='h-6 w-6 text-white' />
                          </div>
                          <div>
                            <h3 className='text-lg font-bold text-white'>
                              {note.kategori}
                            </h3>
                            <p className='text-sm text-white/80'>
                              {note.Kelas?.nama} • {note.Kelas?.tahunAjaran}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='p-6'>
                        <div className='prose prose-sm mb-4 max-w-none'>
                          <p className='line-clamp-3 leading-relaxed text-gray-700'>
                            {stripHtml(note.content)}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedNote(note);
                            setIsModalOpen(true);
                          }}
                          className='flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700'
                        >
                          Baca Selengkapnya →
                        </button>
                      </div>

                      <div className='border-t border-gray-100 bg-gray-50 px-6 py-4'>
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-2 text-gray-500'>
                            <Clock className='h-4 w-4' />
                            <span>{formatDate(note.time)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {isModalOpen && selectedNote && (
        <div className='fixed inset-0 z-50 animate-[fadeIn_0.2s_ease-out]'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsModalOpen(false)}
          />
          <div className='absolute inset-x-0 bottom-0 animate-[slideUp_0.3s_ease-out] p-4 md:inset-0 md:flex md:items-center md:justify-center'>
            <div className='relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-2xl md:rounded-3xl'>
              <div
                className={`bg-gradient-to-r ${getCategoryConfig(selectedNote.kategori).color} px-6 py-5`}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h2 className='mb-2 text-2xl font-bold text-white'>
                      {selectedNote.kategori}
                    </h2>
                    <p className='text-white/90'>
                      {selectedNote.Kelas?.nama} •{' '}
                      {selectedNote.Kelas?.tahunAjaran}
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
                style={{ maxHeight: 'calc(90vh - 200px)' }}
              >
                <div
                  className='prose prose-sm mb-6 max-w-none text-gray-700'
                  dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                />

                <div className='space-y-3 border-t border-gray-200 pt-4'>
                  <div className='flex items-center gap-3'>
                    <Clock className='h-5 w-5 text-gray-400' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>Waktu</p>
                      <p className='text-sm text-gray-600'>
                        {formatDate(selectedNote.time)}
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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideUp { from { transform: translateY(100%);} to { transform: translateY(0);} }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .prose p { margin-bottom: 1em; }
      `}</style>
    </div>
  );
}
