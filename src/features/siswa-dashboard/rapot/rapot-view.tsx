'use client';

import { Card, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import {
  ArrowLeft,
  Calendar,
  CalendarIcon,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  FileTextIcon,
  GraduationCap,
  TrendingUp,
  User
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

export default function RapotView() {
  const { data: session } = useSession();

  // ==============================
  // QUERY: Get Rapot
  // ==============================
  const {
    data: rapot,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['rapot', session?.user?.token],
    queryFn: async () => {
      const res = await api.get('siswa/rapot', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token // jalan hanya kalau token ada
    // staleTime: 1000 * 60, // cache 1 menit
    // retry: 1 // retry sekali kalau gagal
  });

  const publishedCount = rapot?.filter(
    (r: any) => r.rapotSiswa === 'Terbit'
  ).length;
  // const avgScore =
  //   rapot?
  //     .filter((r: any) => r.nilaiRataRata)
  //     .reduce((sum: any, r: any) => sum + r.nilaiRataRata, 0) /
  //     publishedCount || 0;

  const formatDate = (dateString: any) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const downloadRapot = (idKelas: any, tahunAjaran: any) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}rapot3?idKelas=${idKelas}&idSiswa=${session?.user?.idGuru}&tahunAjaran=${tahunAjaran}`;
  };

  if (isLoading) {
    return (
      <div className='p-4'>
        <NavbarSiswa title='Rapot' />
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (isError) {
    toast.error(
      (error as any)?.response?.data?.message || 'Gagal memuat rapot'
    );
    return (
      <div className='p-4'>
        <NavbarSiswa title='Rapot' />
        <p className='text-sm text-red-500'>Something wrong</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
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
              <FileText className='h-7 w-7 text-white' />
            </div>
            <div>
              <h1 className='text-base font-bold text-white lg:text-2xl'>
                Digital Report Card
              </h1>
              <p className='text-sm text-blue-100'>
                Learning performance report
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <div className='mb-2 flex items-center gap-2'>
                <FileText className='h-5 w-5 text-white' />
                <p className='text-xs text-blue-100'>Total</p>
              </div>
              <p className='text-2xl font-bold text-white'>{rapot.length}</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
              <div className='mb-2 flex items-center gap-2'>
                <CheckCircle className='h-5 w-5 text-white' />
                <p className='text-xs text-blue-100'>Published</p>
              </div>
              <p className='text-2xl font-bold text-white'>{publishedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10 mx-auto -mt-16 max-w-6xl px-4'>
        {isLoading ? (
          <div className='py-12 text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Loading data...</p>
          </div>
        ) : rapot.length === 0 ? (
          <div className='rounded-2xl bg-white py-12 text-center shadow-xl'>
            <FileText className='mx-auto mb-4 h-16 w-16 text-gray-300' />
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              No report available yet
            </h3>
            <p className='text-gray-500'>
              The report will appear once it has been published by the teacher
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {rapot.map((rapot: any) => (
              <div
                key={rapot.id}
                className={`overflow-hidden rounded-2xl border-l-4 bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${
                  rapot.rapotSiswa === 'Terbit'
                    ? 'border-green-500'
                    : 'border-gray-300'
                }`}
              >
                <div className='p-6'>
                  <div className='flex flex-col justify-between gap-4 lg:flex-row lg:items-center'>
                    {/* Left Content */}
                    <div className='flex-1'>
                      <div className='mb-3 flex items-center gap-2'>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            rapot.rapotSiswa === 'Terbit'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rapot.rapotSiswa === 'Terbit'
                            ? '✓ Published'
                            : '⏳ Not Published'}
                        </span>
                      </div>

                      <h3 className='mb-3 flex items-center gap-2 text-xl font-bold text-gray-900'>
                        <GraduationCap className='h-6 w-6 text-blue-600' />
                        {rapot.namaKelas} - {rapot.tahunAjaran}
                      </h3>

                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-gray-700'>
                          <User className='h-4 w-4 text-gray-400' />
                          <span className='text-sm'>
                            Homeroom Teacher: {rapot.namaGuru}
                          </span>
                        </div>

                        {rapot.nilaiRataRata && (
                          <div className='flex items-center gap-2'>
                            <TrendingUp className='h-4 w-4 text-gray-400' />
                            <span className='text-sm text-gray-700'>
                              Rata-rata:
                              <span
                                className={`ml-1 font-bold ${
                                  rapot.nilaiRataRata >= 85
                                    ? 'text-green-600'
                                    : rapot.nilaiRataRata >= 70
                                      ? 'text-yellow-600'
                                      : 'text-red-600'
                                }`}
                              >
                                {rapot.nilaiRataRata}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className='flex flex-col gap-3 lg:items-end'>
                      {rapot.rapotSiswa === 'Terbit' ? (
                        <>
                          <a
                            href={`/siswa/rapot/${rapot.idKelas}`}
                            className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg active:scale-95 lg:w-auto'
                          >
                            <Eye className='h-5 w-5' />
                            See Detail
                          </a>
                          <Button
                            onClick={() =>
                              downloadRapot(rapot.idKelas, rapot.tahunAjaran)
                            }
                            className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50 active:scale-95 lg:w-auto'
                          >
                            <Download className='h-5 w-5' />
                            Download PDF
                          </Button>
                        </>
                      ) : (
                        <div className='rounded-xl bg-gray-50 p-4 text-center'>
                          <Clock className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                          <p className='text-sm font-semibold text-gray-600'>
                            Not Available
                          </p>
                          <p className='mt-1 text-xs text-gray-500'>
                            Waiting for publication
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {/* {rapot.nilaiRataRata && (
                  <div className='border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3'>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        Learning Progress
                      </span>
                      <span className='font-bold text-blue-600'>
                        {rapot.nilaiRataRata}%
                      </span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          rapot.nilaiRataRata >= 85
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : rapot.nilaiRataRata >= 70
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}
                        style={{ width: `${rapot.nilaiRataRata}%` }}
                      ></div>
                    </div>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      {rapot.length > 0 && (
        <div className='mx-auto mt-8 max-w-6xl px-4'>
          <div className='rounded-2xl border border-blue-200 bg-blue-50 p-6'>
            <div className='flex items-start gap-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600'>
                <FileText className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='mb-2 text-lg font-bold text-blue-900'>
                  Digital Report Card Information
                </h3>
                <ul className='space-y-1 text-sm text-blue-800'>
                  <li>• The report card can be downloaded in PDF format</li>
                  <li>
                    • The report card is issued at the end of each semester
                  </li>
                  <li>
                    • Contact the homeroom teacher if you have any questions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
