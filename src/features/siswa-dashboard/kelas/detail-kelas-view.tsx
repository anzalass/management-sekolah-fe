'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpenText,
  ClipboardList,
  CalendarDays,
  StepBack
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import api from '@/lib/api';
import Link from 'next/link';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';

type DetailKelasId = { id: string };

export default function DetailKelasView({ id }: DetailKelasId) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('materi');
  const [materiFilter, setMateriFilter] = useState<'all' | 'selesai' | 'belum'>(
    'all'
  );
  const [tugasFilter, setTugasFilter] = useState<'all' | 'selesai' | 'belum'>(
    'all'
  );

  const getData = async () => {
    try {
      const res = await api.get(`kelas-mapel/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      if (res.status === 200) {
        setData(res.data.data);
      }
      console.log(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const filteredMateri = data?.MateriMapel?.filter((m: any) => {
    const matchFilter =
      materiFilter === 'all'
        ? true
        : materiFilter === 'selesai'
          ? m.past
          : !m.past;
    const matchSearch = m.judul.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filteredTugas = data?.TugasMapel?.filter((t: any) => {
    const matchFilter =
      tugasFilter === 'all'
        ? true
        : tugasFilter === 'selesai'
          ? t.past
          : !t.past;
    const matchSearch = t.judul.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filteredUjian = data?.UjianMapel?.filter((t: any) => {
    const matchSearch = t.nama.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className='w-fullspace-y-2 mx-auto mb-14 sm:space-y-6'>
      {/* Header */}

      <NavbarSiswa title={`${data?.namaMapel} - ${data?.namaGuru}`} />
      <BottomNav />
      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className='p-4'>
        {/* Materi */}
        <TabsContent value='materi'>
          {/* Filter */}
          <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <TabsList className='mb-4'>
              <TabsTrigger value='materi'>Materi</TabsTrigger>
              <TabsTrigger value='tugas'>Tugas</TabsTrigger>
              <TabsTrigger value='ujian'>Ujian</TabsTrigger>
            </TabsList>
            <Select
              onValueChange={(val: any) => setMateriFilter(val)}
              defaultValue='all'
            >
              <SelectTrigger className='w-full sm:w-[160px]'>
                <SelectValue placeholder='Filter Materi' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua</SelectItem>
                <SelectItem value='selesai'>Selesai</SelectItem>
                <SelectItem value='belum'>Belum Selesai</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder='Cari materi...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full sm:w-64'
            />
          </div>

          <Card>
            <CardHeader className='flex items-center gap-2'>
              <BookOpenText className='h-5 w-5 text-blue-500' />
              <CardTitle>Materi Kelas</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {filteredMateri?.map((materi: any) => (
                <Link
                  key={materi.id}
                  href={`/siswa/kelas/${id}/materi/${materi.id}`}
                >
                  <div className='rounded border px-2 py-3 transition hover:bg-muted'>
                    <div className='flex items-start justify-between'>
                      <div className='w-[65%]'>
                        <h4 className='text-sm font-semibold md:text-base'>
                          {materi.judul}
                        </h4>

                        <div className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                          <CalendarDays className='h-4 w-4' />
                          {materi?.tanggal
                            ? new Date(materi?.tanggal).toLocaleDateString(
                                'id-ID',
                                {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                }
                              )
                            : ''}
                        </div>
                      </div>
                      <Badge
                        className={
                          materi.past === true
                            ? 'bg-green-500 p-1 text-xs'
                            : 'bg-yellow-400 p-1 text-xs'
                        }
                      >
                        {materi.past === true ? 'Selesai' : 'Belum Selesai'}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
              {filteredMateri?.length === 0 && (
                <p className='col-span-full text-center text-sm text-muted-foreground'>
                  Tidak ada materi.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tugas */}
        <TabsContent value='tugas'>
          {/* Filter */}
          <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <TabsList className='mb-4'>
              <TabsTrigger value='materi'>Materi</TabsTrigger>
              <TabsTrigger value='tugas'>Tugas</TabsTrigger>
              <TabsTrigger value='ujian'>Ujian</TabsTrigger>
            </TabsList>
            <Select
              onValueChange={(val: any) => setTugasFilter(val)}
              defaultValue='all'
            >
              <SelectTrigger className='w-full sm:w-[160px]'>
                <SelectValue placeholder='Filter Tugas' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua</SelectItem>
                <SelectItem value='selesai'>Selesai</SelectItem>
                <SelectItem value='belum'>Belum Selesai</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder='Cari tugas...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full sm:w-64'
            />
          </div>

          <Card>
            <CardHeader className='flex items-center gap-2'>
              <ClipboardList className='h-5 w-5 text-yellow-500' />
              <CardTitle>Tugas Kelas</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {filteredTugas?.map((tugas: any) => (
                <Link
                  key={tugas.id}
                  href={`/siswa/kelas/${id}/tugas/${tugas.id}`}
                >
                  <div className='rounded border px-2 py-3 transition hover:bg-muted'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h4 className='text-sm font-semibold md:text-base'>
                          {tugas.judul}
                        </h4>
                        <p className='my-2 text-sm text-muted-foreground'>
                          {tugas.deskripsi}
                        </p>
                        <div className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                          <CalendarDays className='h-4 w-4' />
                          Deadline :{' '}
                          {tugas?.deadline
                            ? new Date(tugas?.deadline).toLocaleDateString(
                                'id-ID',
                                {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                }
                              )
                            : ''}
                        </div>
                      </div>
                      <Badge
                        className={
                          tugas.past ? 'bg-green-500' : 'bg-yellow-400'
                        }
                      >
                        {tugas.past ? 'Selesai' : 'Belum Selesai'}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
              {filteredTugas?.length === 0 && (
                <p className='col-span-full text-center text-sm text-muted-foreground'>
                  Tidak ada tugas.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='ujian'>
          {/* Filter */}
          <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <TabsList className='mb-4'>
              <TabsTrigger value='materi'>Materi</TabsTrigger>
              <TabsTrigger value='tugas'>Tugas</TabsTrigger>
              <TabsTrigger value='ujian'>Ujian</TabsTrigger>
            </TabsList>

            <Input
              placeholder='Cari ujian...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full sm:w-64'
            />
          </div>

          <Card>
            <CardHeader className='flex items-center gap-2'>
              <ClipboardList className='h-5 w-5 text-yellow-500' />
              <CardTitle>Ujian Kelas</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {filteredUjian?.map((ujian: any) => {
                const content = (
                  <div
                    className={`rounded border px-2 py-3 transition ${
                      ujian.past
                        ? 'cursor-not-allowed bg-gray-100 opacity-70'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <h4 className='text-sm font-semibold md:text-base'>
                          {ujian.nama}
                        </h4>
                        <div className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                          <CalendarDays className='h-4 w-4' />
                          Deadline :{' '}
                          {ujian?.deadline
                            ? new Date(ujian?.deadline).toLocaleDateString(
                                'id-ID',
                                {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                }
                              )
                            : ''}
                        </div>
                      </div>
                      <Badge
                        className={
                          ujian.past ? 'bg-green-500' : 'bg-yellow-400'
                        }
                      >
                        {ujian.past ? 'Selesai' : 'Belum Selesai'}
                      </Badge>
                    </div>
                  </div>
                );

                return ujian.past ? (
                  <div key={ujian.id}>{content}</div> // hanya div biasa
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
                <p className='col-span-full text-center text-sm text-muted-foreground'>
                  Tidak ada ujian.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
