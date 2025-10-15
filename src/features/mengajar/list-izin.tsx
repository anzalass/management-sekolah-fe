'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar, Search, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Izin = {
  id: string;
  time: string;
  keterangan: string;
  buktiUrl?: string;
  status: 'disetujui' | 'menunggu' | 'ditolak';
};

export type KehadiranGuru = {
  id: string;
  tanggal: string;
  jamMasuk?: string;
  jamPulang?: string;
  status: string;
  nama: string;
  nip: string;
};

const statusColor = {
  disetujui: 'bg-green-100 text-green-700',
  menunggu: 'bg-yellow-100 text-yellow-700',
  ditolak: 'bg-red-100 text-red-700'
};

export default function CardListIzin() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [toggleTab, setToggleTab] = useState<'perizinan' | 'kehadiran'>(
    'perizinan'
  );

  // Filter izin
  const [searchIzin, setSearchIzin] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'semua' | 'disetujui' | 'menunggu' | 'ditolak'
  >('semua');

  // State untuk kehadiran
  const [tanggalKehadiran, setTanggalKehadiran] = useState('');
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(1);

  // --- Query Izin ---
  const { data: izinList = [], isPending: izinLoading } = useQuery<Izin[]>({
    queryKey: ['izin', session?.user?.token],
    queryFn: async () => {
      const res = await api.get(`perizinan-guru`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data || [];
    },
    enabled: !!session?.user?.token
  });

  // --- Query Kehadiran ---
  const { data: dataKehadiran = [], isPending: loadingKehadiran } = useQuery<
    KehadiranGuru[]
  >({
    queryKey: [
      'kehadiran',
      session?.user?.token,
      page,
      pageLimit,
      tanggalKehadiran
    ],
    queryFn: async () => {
      const res = await api.get(
        `kehadiran-guru?page=${page}&pageSize=${pageLimit}&nip=${session?.user?.nip}&tanggal=${tanggalKehadiran}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      return res.data.data.data || [];
    },
    enabled: !!session?.user?.token
  });

  // --- Mutasi Delete Izin ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/perizinan-guru/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success('Data izin berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['izin'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const filteredIzin = useMemo(() => {
    return izinList.filter((izin) => {
      const cocokStatus =
        statusFilter === 'semua' || izin.status === statusFilter;
      const cocokSearch = izin.keterangan
        .toLowerCase()
        .includes(searchIzin.toLowerCase());
      return cocokStatus && cocokSearch;
    });
  }, [izinList, searchIzin, statusFilter]);

  return (
    <Card className='space-y-6 p-5'>
      {/* Tab toggle */}
      <div className='mb-4 flex space-x-3'>
        <Button
          variant={toggleTab === 'perizinan' ? 'default' : 'outline'}
          onClick={() => setToggleTab('perizinan')}
        >
          Perizinan
        </Button>
        <Button
          variant={toggleTab === 'kehadiran' ? 'default' : 'outline'}
          onClick={() => setToggleTab('kehadiran')}
        >
          Kehadiran
        </Button>
      </div>

      {toggleTab === 'perizinan' ? (
        <>
          {/* Filter Perizinan */}
          <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center'>
            <div className='relative w-full md:w-1/2'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari berdasarkan keterangan...'
                className='pl-10'
                value={searchIzin}
                onChange={(e) => setSearchIzin(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Filter status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='semua'>Semua Status</SelectItem>
                <SelectItem value='disetujui'>Disetujui</SelectItem>
                <SelectItem value='menunggu'>Menunggu</SelectItem>
                <SelectItem value='ditolak'>Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* List Perizinan */}
          {izinLoading ? (
            <p className='text-center text-muted-foreground'>Loading...</p>
          ) : filteredIzin.length === 0 ? (
            <p className='text-center text-muted-foreground'>
              Tidak ada data izin yang cocok.
            </p>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {filteredIzin.map((izin) => (
                <Card
                  key={izin.id}
                  className='rounded-2xl border border-muted shadow-sm transition hover:shadow-md'
                >
                  <CardContent className='space-y-3 p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Calendar className='h-4 w-4' />
                        <span>
                          {new Date(izin.time).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <Badge className={statusColor[izin.status]}>
                        {izin.status.charAt(0).toUpperCase() +
                          izin.status.slice(1)}
                      </Badge>
                    </div>

                    <div>
                      <p className='text-sm font-medium'>Keterangan:</p>
                      <p className='text-sm'>{izin.keterangan}</p>
                    </div>

                    {izin.status === 'menunggu' && (
                      <div className='flex gap-2 pt-2'>
                        <Button
                          variant='destructive'
                          size='sm'
                          disabled={
                            deleteMutation.isPending &&
                            deleteMutation.variables === izin.id
                          }
                          onClick={() => deleteMutation.mutate(izin.id)}
                        >
                          {deleteMutation.isPending &&
                          deleteMutation.variables === izin.id ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Filter Kehadiran */}
          <div className='mb-4 flex gap-4'>
            <Input
              type='date'
              placeholder='Tanggal'
              value={tanggalKehadiran}
              onChange={(e) => setTanggalKehadiran(e.target.value)}
              className='max-w-[180px]'
            />
            <Select
              value={String(pageLimit)}
              onValueChange={(val) => setPageLimit(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Limit / halaman' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5</SelectItem>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type='number'
              placeholder='Halaman'
              value={page}
              min={1}
              onChange={(e) => setPage(Number(e.target.value))}
              className='max-w-[80px]'
            />
          </div>
          <div className='mx-auto w-[100%] overflow-x-auto'>
            <Table className='w-[200vw] overflow-auto border lg:w-[100vw]'>
              <TableHeader className=''>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Pulang</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loadingKehadiran ? (
                  <TableRow>
                    <TableCell colSpan={6} className='py-6 text-center'>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : dataKehadiran.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='py-6 text-center'>
                      Tidak ada data kehadiran
                    </TableCell>
                  </TableRow>
                ) : (
                  dataKehadiran.map((item) => (
                    <TableRow key={item.id} className=''>
                      <TableCell>
                        {new Date(item.tanggal).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.nip}</TableCell>
                      <TableCell>
                        {item.jamMasuk
                          ? format(
                              new Date(item.jamMasuk),
                              'dd MMM yyyy, HH:mm',
                              { locale: id }
                            )
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {item.jamPulang
                          ? format(
                              new Date(item.jamPulang),
                              'dd MMM yyyy, HH:mm',
                              { locale: id }
                            )
                          : '-'}
                      </TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Card>
  );
}
