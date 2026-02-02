'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Eye,
  Filter,
  Image,
  Search,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import WeeklyActivityFilterMobile from './filter-weekly-mobile';
import EmptyState from '../empty-state';
import Loading from '../loading';
import Link from 'next/link';

interface FotoWeeklyActivity {
  id: string;
  fotoUrl: string;
}

interface WeeklyActivity {
  id: string;
  content: string;
  waktu: string;
  FotoWeeklyActivity: FotoWeeklyActivity[];
}

export default function WeeklyActivityList() {
  const { data: session } = useSession();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchContent, setSearchContent] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data function
  const fetchWeeklyActivity = async (): Promise<WeeklyActivity[]> => {
    if (!session?.user?.token) return [];
    const res = await api.get('weekly-activity', {
      headers: {
        Authorization: `Bearer ${session.user.token}`
      }
    });
    return res.data.data;
  };

  // React Query
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery<WeeklyActivity[], unknown>({
    queryKey: ['weekly-activity'],
    queryFn: fetchWeeklyActivity,
    enabled: !!session?.user?.token
    // staleTime: 1000 * 60 * 5 // 5 menit cache
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
  // Filtered data
  const filteredData = data.filter((item: any) => {
    const matchesContent = searchContent
      ? item.content.toLowerCase().includes(searchContent.toLowerCase())
      : true;
    const matchesDate = searchDate
      ? item.waktu.split('T')[0] === searchDate
      : true;
    return matchesContent && matchesDate;
  });

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'foto_weekly.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`weekly-activity/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      toast.success('Berhasil Menghapus Weekly Activity');
      refetch(); // reload data
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return <Loading />;
  if (error)
    return <p className='p-4 text-center text-red-500'>Gagal memuat data</p>;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-20'>
      <div className={`${process.env.NEXT_PUBLIC_THEME_COLOR} px-4 pb-8 pt-6`}>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-4 flex items-center gap-3'>
            <Link
              href={'/siswa'}
              className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'
            >
              <ArrowLeft className='h-7 w-7 text-white' />
            </Link>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20'>
              <Calendar className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-base font-bold text-white lg:text-2xl'>
                Weekly Activity
              </h1>
              <p className='text-sm text-purple-100'>
                Weekly activity documentation
              </p>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md'>
              <p className='text-2xl font-bold text-white'>{data.length}</p>
              <p className='text-xs text-purple-100'>Total</p>
            </div>
            <div className='rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md'>
              <p className='text-2xl font-bold text-white'>
                {data.reduce(
                  (sum, item) => sum + item.FotoWeeklyActivity.length,
                  0
                )}
              </p>
              <p className='text-xs text-purple-100'>Foto</p>
            </div>
            <div className='rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md'>
              <p className='text-2xl font-bold text-white'>
                {filteredData.length}
              </p>
              <p className='text-xs text-purple-100'>Show</p>
            </div>
          </div>
        </div>
      </div>

      <div className='relative z-10 mx-auto -mt-4 mb-6 max-w-7xl px-4'>
        <div className='rounded-2xl bg-white p-4 shadow-xl'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search Activity...'
                value={searchContent}
                onChange={(e) => setSearchContent(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-purple-500 focus:outline-none'
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                showFilter
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              <Filter className='h-5 w-5' />
            </button>
          </div>
          {showFilter && (
            <div className='mt-3 space-y-3'>
              <input
                type='date'
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'
              />
              <button
                onClick={() => {
                  setSearchContent('');
                  setSearchDate('');
                }}
                className='w-full rounded-xl bg-gray-100 py-3 text-gray-700'
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4'>
        {filteredData.length === 0 ? (
          <div className='py-12 text-center'>
            <Calendar className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <h3 className='text-lg font-semibold text-gray-900'>No Activity</h3>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredData.map((activity: any) => (
              <div
                key={activity.id}
                className='overflow-hidden rounded-2xl bg-white shadow-lg'
              >
                <div className='bg-blue-800 px-5 py-4'>
                  <h3 className='mb-2 text-lg font-bold text-white'>
                    {activity.judul}
                  </h3>
                  <div className='flex items-center gap-2 text-sm text-purple-100'>
                    <Clock className='h-4 w-4' />
                    <span>{formatDate(activity.waktu)}</span>
                  </div>
                </div>
                <div className='p-5'>
                  <div
                    className='py-4'
                    dangerouslySetInnerHTML={{ __html: activity?.content }}
                  ></div>
                  <div className='grid grid-cols-2 gap-2'>
                    {activity.FotoWeeklyActivity.map((foto: any) => (
                      <div
                        key={foto.id}
                        className='group relative cursor-pointer overflow-hidden rounded-xl'
                        onClick={() => {
                          setSelectedPhoto(foto);
                          setIsModalOpen(true);
                        }}
                      >
                        <img
                          src={foto.fotoUrl}
                          alt='Activity'
                          className='h-40 w-full object-cover transition-transform group-hover:scale-110'
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/50'>
                          <Eye className='h-8 w-8 text-white opacity-0 group-hover:opacity-100' />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='mt-4 flex items-center gap-2 border-t pt-4 text-sm text-gray-600'>
                    <Image className='h-4 w-4' />
                    <span>{activity.FotoWeeklyActivity.length} Photo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedPhoto && (
        <div className='fixed inset-0 z-50'>
          <div
            className='absolute inset-0 bg-black/80'
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className='absolute inset-0 flex items-center justify-center p-4'>
            <div className='relative w-full max-w-4xl rounded-3xl bg-white'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50'
              >
                <X className='h-6 w-6 text-white' />
              </button>
              <img
                src={selectedPhoto?.fotoUrl}
                alt='Detail'
                className='max-h-[70vh] w-full rounded-t-3xl bg-gray-100 object-contain'
              />
              <div className='p-6'>
                <p className='mb-4 text-sm text-gray-600'>
                  Press and hold for download
                </p>
                <a
                  href={selectedPhoto?.fotoUrl}
                  download
                  className={`flex items-center justify-center gap-2 rounded-full ${process.env.NEXT_PUBLIC_THEME_COLOR} px-6 py-3 font-semibold text-white`}
                >
                  <Download className='h-5 w-5' />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
