'use client';
import { useState } from 'react';
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

export default function NotificationPage() {
  const [filter, setFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Dummy data
  const notifications = [
    {
      id: '1',
      idSiswa: 'siswa-001',
      idKelas: 'kelas-10a',
      idGuru: null,
      redirectSiswa: '/siswa/tugas/math-001',
      redirectGuru: null,
      status: 'unread',
      idTerkait: 'tugas-001',
      kategori: 'tugas',
      keterangan:
        'Tugas Matematika "Integral dan Diferensial" sudah tersedia. Deadline: 25 Oktober 2025',
      createdAt: '2025-10-03T10:30:00',
      createdBy: 'guru-math-001'
    },
    {
      id: '2',
      idSiswa: 'siswa-001',
      idKelas: null,
      idGuru: null,
      redirectSiswa: '/siswa/pembayaran',
      redirectGuru: null,
      status: 'read',
      idTerkait: 'payment-001',
      kategori: 'pembayaran',
      keterangan: 'Pembayaran SPP bulan Oktober berhasil! Total Rp 500.000',
      createdAt: '2025-10-02T14:20:00',
      createdBy: 'system'
    },
    {
      id: '3',
      idSiswa: 'siswa-001',
      idKelas: null,
      idGuru: null,
      redirectSiswa: '/siswa/prestasi',
      redirectGuru: null,
      status: 'unread',
      idTerkait: 'prestasi-001',
      kategori: 'prestasi',
      keterangan:
        'Selamat! Anda mendapat juara 1 Lomba Matematika Tingkat Provinsi 🏆',
      createdAt: '2025-10-01T09:15:00',
      createdBy: 'admin-001'
    },
    {
      id: '4',
      idSiswa: 'siswa-001',
      idKelas: 'kelas-10a',
      idGuru: 'guru-fisika',
      redirectSiswa: '/siswa/nilai',
      redirectGuru: null,
      status: 'read',
      idTerkait: 'nilai-001',
      kategori: 'nilai',
      keterangan: 'Nilai Ulangan Fisika Bab 3 sudah keluar. Nilai kamu: 85',
      createdAt: '2025-09-30T16:45:00',
      createdBy: 'guru-fisika'
    },
    {
      id: '5',
      idSiswa: 'siswa-001',
      idKelas: null,
      idGuru: null,
      redirectSiswa: '/siswa/pengumuman',
      redirectGuru: null,
      status: 'unread',
      idTerkait: 'pengumuman-001',
      kategori: 'pengumuman',
      keterangan:
        'Libur Nasional: Sekolah diliburkan pada tanggal 28 Oktober 2025',
      createdAt: '2025-09-29T08:00:00',
      createdBy: 'admin-001'
    },
    {
      id: '6',
      idSiswa: 'siswa-001',
      idKelas: 'kelas-10a',
      idGuru: null,
      redirectSiswa: '/siswa/pelanggaran',
      redirectGuru: null,
      status: 'read',
      idTerkait: 'pelanggaran-001',
      kategori: 'pelanggaran',
      keterangan: 'Anda mendapat peringatan karena terlambat 3 kali minggu ini',
      createdAt: '2025-09-28T11:30:00',
      createdBy: 'guru-bk'
    },
    {
      id: '7',
      idSiswa: 'siswa-001',
      idKelas: null,
      idGuru: null,
      redirectSiswa: '/siswa/kalender',
      redirectGuru: null,
      status: 'unread',
      idTerkait: 'event-001',
      kategori: 'jadwal',
      keterangan:
        'Reminder: Ujian Tengah Semester dimulai besok tanggal 4 Oktober 2025',
      createdAt: '2025-09-27T15:00:00',
      createdBy: 'system'
    },
    {
      id: '8',
      idSiswa: 'siswa-001',
      idKelas: 'kelas-10a',
      idGuru: 'guru-english',
      redirectSiswa: '/siswa/tugas/english-001',
      redirectGuru: null,
      status: 'read',
      idTerkait: 'tugas-002',
      kategori: 'tugas',
      keterangan:
        'Tugas Bahasa Inggris "Essay Writing" sudah dinilai. Nilai: 90',
      createdAt: '2025-09-26T13:20:00',
      createdBy: 'guru-english'
    }
  ];

  const categories = [
    { value: 'all', label: 'Semua', icon: Bell, color: 'text-gray-600' },
    { value: 'tugas', label: 'Tugas', icon: BookOpen, color: 'text-blue-600' },
    {
      value: 'pembayaran',
      label: 'Pembayaran',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      value: 'prestasi',
      label: 'Prestasi',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      value: 'nilai',
      label: 'Nilai',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      value: 'pengumuman',
      label: 'Pengumuman',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    {
      value: 'pelanggaran',
      label: 'Pelanggaran',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      value: 'jadwal',
      label: 'Jadwal',
      icon: Calendar,
      color: 'text-indigo-600'
    }
  ];

  const getCategoryConfig = (kategori: any) => {
    const config = categories.find((c) => c.value === kategori);
    return config || categories[0];
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.kategori === filter);

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
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
                <h1 className='text-xl font-bold text-white'>Notifikasi</h1>
                <p className='text-sm text-blue-100'>
                  {filteredNotifications.length} notifikasi
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
                    : notifications.filter((n) => n.kategori === cat.value)
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

      {/* Notifications List */}
      <div className='mx-auto max-w-6xl px-4 py-4'>
        <div className='space-y-3'>
          {filteredNotifications.length === 0 ? (
            <div className='py-16 text-center'>
              <Bell className='mx-auto mb-4 h-16 w-16 text-gray-300' />
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Tidak ada notifikasi
              </h3>
              <p className='text-gray-500'>
                Belum ada notifikasi{' '}
                {filter !== 'all' ? `kategori ${filter}` : ''}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
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
                    {/* Icon */}
                    <div
                      className={`h-12 w-12 flex-shrink-0 rounded-xl ${
                        notif.status === 'unread'
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      } flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${categoryConfig.color}`} />
                    </div>

                    {/* Content */}
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
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            alert('Hapus notifikasi');
                          }}
                          className='p-1 text-gray-400 transition-all hover:text-red-500 active:scale-95'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
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
                        <span>{formatDate(notif.createdAt)}</span>
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

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className='mt-6 text-center'>
            <button className='rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-md transition-all duration-200 active:scale-95'>
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
