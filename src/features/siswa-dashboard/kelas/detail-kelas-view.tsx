'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpenText,
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  Clock,
  Filter,
  FileText,
  Search,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';
import Loading from '../loading';

type DetailKelasId = { id: string };

type Materi = { id: string; judul: string; tanggal?: string; past: boolean };
type Tugas = {
  id: string;
  judul: string;
  deskripsi?: string;
  deadline?: string;
  past: boolean;
};
type Ujian = { id: string; nama: string; deadline?: string; past: boolean };

type KelasData = {
  namaMapel: string;
  namaGuru: string;
  MateriMapel: Materi[];
  TugasMapel: Tugas[];
  UjianMapel: Ujian[];
};

export default function DetailKelasView({ id }: DetailKelasId) {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('materi');
  const [materiFilter, setMateriFilter] = useState<'all' | 'selesai' | 'belum'>(
    'all'
  );
  const [tugasFilter, setTugasFilter] = useState<'all' | 'selesai' | 'belum'>(
    'all'
  );

  const { data, isLoading, error } = useQuery<KelasData>({
    queryKey: ['kelas', id, session?.user?.token],
    queryFn: async () => {
      const res = await api.get(`kelas-mapel/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
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

  if (isLoading) return <Loading />;
  if (error)
    return <p className='p-4 text-center text-red-500'>Error loading data.</p>;

  const filteredMateri = data?.MateriMapel.filter((m) => {
    const matchFilter =
      materiFilter === 'all'
        ? true
        : materiFilter === 'selesai'
          ? m.past
          : !m.past;
    const matchSearch = m.judul.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filteredTugas = data?.TugasMapel.filter((t) => {
    const matchFilter =
      tugasFilter === 'all'
        ? true
        : tugasFilter === 'selesai'
          ? t.past
          : !t.past;
    const matchSearch = t.judul.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filteredUjian = data?.UjianMapel.filter((u) =>
    u.nama.toLowerCase().includes(search.toLowerCase())
  );

  const SedangBerlangsung = async (ujian: any) => {
    try {
      await api.post(
        `ujian-iframe-berlangsung`,
        {
          idSiswa: session?.user?.idGuru,
          idUjianIframe: ujian.id,
          idKelasMapel: id
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='mx-auto mb-14 min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50'>
      <NavbarSiswa title='Detail Class' />
      <Tabs
        value={tab}
        onValueChange={setTab}
        className='mx-auto max-w-7xl px-4 pb-6'
      >
        {/* Header with Tabs */}
        <TabsList className='my-3 grid h-[70px] w-full grid-cols-3 rounded-2xl bg-white p-1.5 shadow-md sm:inline-grid sm:w-auto'>
          <TabsTrigger
            value='materi'
            className='flex h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30' // <-- tambahin tinggi fix
          >
            <BookOpenText className='h-4 w-4' />
            Materi
          </TabsTrigger>

          <TabsTrigger
            value='tugas'
            className='flex h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30'
          >
            <FileText className='h-4 w-4' />
            Task
          </TabsTrigger>

          <TabsTrigger
            value='ujian'
            className='flex h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30'
          >
            <ClipboardList className='h-4 w-4' />
            Exam
          </TabsTrigger>
        </TabsList>

        {/* MATERI TAB */}
        <TabsContent value='materi' className='mt-0 space-y-6'>
          {/* Filter Section */}
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <Select
              onValueChange={(val: any) => setMateriFilter(val)}
              defaultValue='all'
            >
              <SelectTrigger className='h-11 w-full rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:shadow-md focus:ring-2 focus:ring-blue-500 sm:w-[180px]'>
                <Filter className='mr-2 h-4 w-4 text-gray-400' />
                <SelectValue placeholder='Filter Status' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='all'>Semua Materi</SelectItem>
                <SelectItem value='selesai'>
                  <span className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    Selesai
                  </span>
                </SelectItem>
                <SelectItem value='belum'>
                  <span className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 text-yellow-500' />
                    Belum Selesai
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className='relative flex-1 sm:max-w-md'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Cari materi...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='h-11 rounded-xl border-gray-200 bg-white pl-11 shadow-sm transition-all focus:shadow-md focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className='grid grid-cols-3 gap-4'>
            <Card className='border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-blue-700'>Total Materi</p>
                <p className='mt-1 text-base font-bold text-blue-900 lg:text-2xl'>
                  {filteredMateri?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className='border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-green-700'>Selesai</p>
                <p className='mt-1 text-base font-bold text-green-900 lg:text-2xl'>
                  {filteredMateri?.filter((m) => m.past).length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className='border-0 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-yellow-700'>Belum Selesai</p>
                <p className='mt-1 text-base font-bold text-yellow-900 lg:text-2xl'>
                  {filteredMateri?.filter((m) => !m.past).length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Materi Grid */}
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredMateri?.map((materi) => (
              <Link
                key={materi.id}
                href={`/siswa/kelas/${id}/materi/${materi.id}`}
              >
                <Card className='group h-full overflow-hidden border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                  <div
                    className={`h-1.5 w-full ${
                      materi.past
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                    }`}
                  />
                  <CardContent className='p-5'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          materi.past ? 'bg-green-100' : 'bg-yellow-100'
                        }`}
                      >
                        <BookOpenText
                          className={`h-6 w-6 ${materi.past ? 'text-green-600' : 'text-yellow-600'}`}
                        />
                      </div>
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          materi.past
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        }`}
                      >
                        {materi.past ? (
                          <>
                            <CheckCircle2 className='mr-1 h-3 w-3' />
                            Selesai
                          </>
                        ) : (
                          <>
                            <Clock className='mr-1 h-3 w-3' />
                            Belum
                          </>
                        )}
                      </Badge>
                    </div>

                    <h4 className='mb-3 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                      {materi.judul}
                    </h4>

                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <CalendarDays className='h-4 w-4' />
                      <span>
                        {materi?.tanggal
                          ? new Date(materi?.tanggal).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }
                            )
                          : '-'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredMateri?.length === 0 && (
              <div className='col-span-full'>
                <Card className='border-0 p-12 text-center shadow-sm'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                    <BookOpenText className='h-8 w-8 text-gray-400' />
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                    Tidak Ada Materi
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Belum ada materi yang tersedia untuk saat ini
                  </p>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TUGAS TAB */}
        <TabsContent value='tugas' className='mt-0 space-y-6'>
          {/* Filter Section */}
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <Select
              onValueChange={(val: any) => setTugasFilter(val)}
              defaultValue='all'
            >
              <SelectTrigger className='h-11 w-full rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:shadow-md focus:ring-2 focus:ring-purple-500 sm:w-[180px]'>
                <Filter className='mr-2 h-4 w-4 text-gray-400' />
                <SelectValue placeholder='Filter Status' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                <SelectItem value='all'>Semua Tugas</SelectItem>
                <SelectItem value='selesai'>
                  <span className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                    Selesai
                  </span>
                </SelectItem>
                <SelectItem value='belum'>
                  <span className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 text-yellow-500' />
                    Belum Selesai
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className='relative flex-1 sm:max-w-md'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Cari tugas...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='h-11 rounded-xl border-gray-200 bg-white pl-11 shadow-sm transition-all focus:shadow-md focus:ring-2 focus:ring-purple-500'
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className='grid grid-cols-3 gap-4'>
            <Card className='border-0 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-purple-700'>Total Tugas</p>
                <p className='mt-1 text-base font-bold text-purple-900 lg:text-2xl'>
                  {filteredTugas?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className='border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-green-700'>Selesai</p>
                <p className='mt-1 text-base font-bold text-green-900 lg:text-2xl'>
                  {filteredTugas?.filter((t) => t.past).length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className='border-0 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-yellow-700'>Belum Selesai</p>
                <p className='mt-1 text-base font-bold text-yellow-900 lg:text-2xl'>
                  {filteredTugas?.filter((t) => !t.past).length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tugas Grid */}
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredTugas?.map((tugas) => (
              <Link
                key={tugas.id}
                href={`/siswa/kelas/${id}/tugas/${tugas.id}`}
              >
                <Card className='group h-full overflow-hidden border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                  <div
                    className={`h-1.5 w-full ${
                      tugas.past
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500'
                    }`}
                  />
                  <CardContent className='p-5'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          tugas.past ? 'bg-green-100' : 'bg-yellow-100'
                        }`}
                      >
                        <FileText
                          className={`h-6 w-6 ${tugas.past ? 'text-green-600' : 'text-yellow-600'}`}
                        />
                      </div>
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          tugas.past
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        }`}
                      >
                        {tugas.past ? (
                          <>
                            <CheckCircle2 className='mr-1 h-3 w-3' />
                            Selesai
                          </>
                        ) : (
                          <>
                            <Clock className='mr-1 h-3 w-3' />
                            Belum
                          </>
                        )}
                      </Badge>
                    </div>

                    <h4 className='mb-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-purple-600'>
                      {tugas.judul}
                    </h4>
                    <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>
                      {tugas.deskripsi}
                    </p>

                    <div className='flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm'>
                      <CalendarDays className='h-4 w-4 text-gray-600' />
                      <span className='text-xs text-muted-foreground'>
                        Deadline:
                      </span>
                      <span className='text-xs font-semibold text-gray-900'>
                        {tugas.deadline
                          ? new Date(tugas.deadline).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }
                            )
                          : '-'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredTugas?.length === 0 && (
              <div className='col-span-full'>
                <Card className='border-0 p-12 text-center shadow-sm'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                    <FileText className='h-8 w-8 text-gray-400' />
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                    Tidak Ada Tugas
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Belum ada tugas yang tersedia untuk saat ini
                  </p>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* UJIAN TAB */}
        <TabsContent value='ujian' className='mt-0 space-y-6'>
          {/* Filter Section */}
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end'>
            <div className='relative flex-1 sm:max-w-md'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Cari ujian...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='h-11 rounded-xl border-gray-200 bg-white pl-11 shadow-sm transition-all focus:shadow-md focus:ring-2 focus:ring-orange-500'
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className='grid grid-cols-3 gap-4'>
            <Card className='border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-orange-700'>Total Ujian</p>
                <p className='lg:text-2xlfont-bold mt-1 text-base text-orange-900'>
                  {filteredUjian?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className='border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-green-700'>Selesai</p>
                <p className='lg:text-2xlfont-bold mt-1 text-base text-green-900'>
                  {filteredUjian?.filter((u) => u.past).length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className='border-0 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-sm'>
              <CardContent className='p-4'>
                <p className='text-sm text-yellow-700'>Belum Selesai</p>
                <p className='lg:text-2xlfont-bold mt-1 text-base text-yellow-900'>
                  {filteredUjian?.filter((u) => !u.past).length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ujian Grid */}
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredUjian?.map((ujian) => {
              const content = (
                <Card
                  onClick={() => SedangBerlangsung(ujian)}
                  className={`group h-full overflow-hidden border-0 bg-white shadow-md transition-all duration-300 ${
                    ujian.past
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >
                  <div
                    className={`h-1.5 w-full ${
                      ujian.past
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}
                  />
                  <CardContent className='p-5'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          ujian.past ? 'bg-green-100' : 'bg-orange-100'
                        }`}
                      >
                        <ClipboardList
                          className={`h-6 w-6 ${ujian.past ? 'text-green-600' : 'text-orange-600'}`}
                        />
                      </div>
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          ujian.past
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        {ujian.past ? (
                          <>
                            <CheckCircle2 className='mr-1 h-3 w-3' />
                            Selesai
                          </>
                        ) : (
                          <>
                            <AlertCircle className='mr-1 h-3 w-3' />
                            Aktif
                          </>
                        )}
                      </Badge>
                    </div>

                    <h4
                      className={`mb-3 line-clamp-2 text-base font-bold text-gray-900 ${!ujian.past && 'transition-colors group-hover:text-orange-600'}`}
                    >
                      {ujian.nama}
                    </h4>

                    <div className='flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm'>
                      <CalendarDays className='h-4 w-4 text-gray-600' />
                      <span className='text-xs text-muted-foreground'>
                        Deadline:
                      </span>
                      <span className='text-xs font-semibold text-gray-900'>
                        {ujian.deadline
                          ? new Date(ujian.deadline).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }
                            )
                          : '-'}
                      </span>
                    </div>

                    {ujian.past && (
                      <div className='mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-2 text-xs text-green-700'>
                        <CheckCircle2 className='h-4 w-4' />
                        Ujian telah selesai
                      </div>
                    )}
                  </CardContent>
                </Card>
              );

              return ujian.past ? (
                <div key={ujian.id}>{content}</div>
              ) : (
                <Link
                  key={ujian.id}
                  href={`/siswa/kelas/${id}/ujian/${ujian.id}`}
                >
                  {content}
                </Link>
              );
            })}

            {filteredUjian?.length === 0 && (
              <div className='col-span-full'>
                <Card className='border-0 p-12 text-center shadow-sm'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                    <ClipboardList className='h-8 w-8 text-gray-400' />
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                    Tidak Ada Ujian
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Belum ada ujian yang tersedia untuk saat ini
                  </p>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <BottomNav />
    </div>
  );
}
