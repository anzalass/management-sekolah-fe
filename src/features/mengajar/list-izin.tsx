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
import { Calendar, Search, Trash2, Loader2, Eye } from 'lucide-react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Izin = {
  id: string;
  time: string;
  keterangan: string;
  bukti?: string;
  status: 'disetujui' | 'menunggu' | 'ditolak';
};

type KehadiranGuru = {
  id: string;
  tanggal: string;
  jamMasuk?: string;
  jamPulang?: string;
  status: string;
  nama: string;
  nip: string;
};

// Tipe respons API baru
type ApiResponse = {
  resultPerizinan: {
    data: Izin[];
    meta: { total: number; page: number; pageSize: number; totalPages: number };
  };
  resultKehadiran: {
    data: KehadiranGuru[];
    meta: { total: number; page: number; pageSize: number; totalPages: number };
  };
};

const statusColor = {
  disetujui: 'bg-green-100 text-green-800',
  menunggu: 'bg-yellow-100 text-yellow-800',
  ditolak: 'bg-red-100 text-red-800'
};

export default function CardListIzin() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [toggleTab, setToggleTab] = useState<'perizinan' | 'kehadiran'>(
    'perizinan'
  );

  // === Filter Perizinan ===
  const [searchIzin, setSearchIzin] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'semua' | 'disetujui' | 'menunggu' | 'ditolak'
  >('semua');
  const [izinPage, setIzinPage] = useState(1);
  const [izinPageSize, setIzinPageSize] = useState(10);
  const [izinStartDate, setIzinStartDate] = useState('');
  const [izinEndDate, setIzinEndDate] = useState('');

  // === Filter Kehadiran ===
  const [kehadiranPage, setKehadiranPage] = useState(1);
  const [kehadiranPageSize, setKehadiranPageSize] = useState(10);
  const [kehadiranStartDate, setKehadiranStartDate] = useState('');
  const [kehadiranEndDate, setKehadiranEndDate] = useState('');

  // Modal foto
  const [modalImage, setModalImage] = useState<string | null>(null);

  // --- Query Gabungan ---
  const { data, isPending, isError } = useQuery<ApiResponse>({
    queryKey: [
      'perizinan-kehadiran-guru',
      session?.user?.idGuru,
      // Perizinan
      izinPage,
      izinPageSize,
      izinStartDate,
      izinEndDate,
      searchIzin,
      statusFilter,
      // Kehadiran
      kehadiranPage,
      kehadiranPageSize,
      kehadiranStartDate,
      kehadiranEndDate
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Params Perizinan
      params.append('idGuru', session?.user?.idGuru || '');
      params.append('pagePerizinan', String(izinPage));
      params.append('pageSizePerizinan', String(izinPageSize));
      if (izinStartDate) params.append('startDatePerizinan', izinStartDate);
      if (izinEndDate) params.append('endDatePerizinan', izinEndDate);

      // Params Kehadiran
      params.append('pageKehadiran', String(kehadiranPage));
      params.append('pageSizeKehadiran', String(kehadiranPageSize));
      if (kehadiranStartDate)
        params.append('startDateKehadiran', kehadiranStartDate);
      if (kehadiranEndDate) params.append('endDateKehadiran', kehadiranEndDate);

      const res = await api.get(
        `/dashboard/perizinan-kehadiran?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
      return res.data;
    },
    enabled: !!session?.user?.idGuru
  });

  const izinList = data?.resultPerizinan.data || [];
  const kehadiranList = data?.resultKehadiran.data || [];

  // --- Mutasi Delete ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/perizinan-guru/delete/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Data izin berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['perizinan-kehadiran-guru'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  // Filter izin di frontend (jika search/status tidak di-handle oleh API)
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
          <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari keterangan...'
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
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='semua'>Semua Status</SelectItem>
                <SelectItem value='disetujui'>Disetujui</SelectItem>
                <SelectItem value='menunggu'>Menunggu</SelectItem>
                <SelectItem value='ditolak'>Ditolak</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type='date'
              placeholder='Dari Tanggal'
              value={izinStartDate}
              onChange={(e) => setIzinStartDate(e.target.value)}
            />

            <Input
              type='date'
              placeholder='Sampai Tanggal'
              value={izinEndDate}
              onChange={(e) => setIzinEndDate(e.target.value)}
            />
          </div>

          {/* Pagination Perizinan */}
          <div className='mb-4 block items-center justify-between gap-3 md:flex'>
            <div className=''>
              <Select
                value={String(izinPageSize)}
                onValueChange={(v) => setIzinPageSize(Number(v))}
              >
                <SelectTrigger className='w-full md:w-24'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>5 / hal</SelectItem>
                  <SelectItem value='10'>10 / hal</SelectItem>
                  <SelectItem value='20'>20 / hal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='mt-5 md:mt-0'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIzinPage((p) => Math.max(1, p - 1))}
                disabled={izinPage <= 1}
              >
                Sebelumnya
              </Button>
              <span className='text-sm'>Halaman {izinPage}</span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIzinPage((p) => p + 1)}
                disabled={
                  !data || izinPage >= data.resultPerizinan.meta.totalPages
                }
              >
                Berikutnya
              </Button>
            </div>
          </div>

          {/* Tabel Perizinan */}
          {isPending ? (
            <p className='py-8 text-center text-muted-foreground'>Loading...</p>
          ) : filteredIzin.length === 0 ? (
            <p className='py-8 text-center text-muted-foreground'>
              Tidak ada data izin.
            </p>
          ) : (
            <div className='overflow-x-auto rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-center'>Bukti</TableHead>
                    <TableHead className='text-center'>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIzin.map((izin) => (
                    <TableRow key={izin.id}>
                      <TableCell>
                        {new Date(izin.time).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className='max-w-xs truncate'>
                        {izin.keterangan}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor[izin.status]}>
                          {izin.status.charAt(0).toUpperCase() +
                            izin.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        {izin.bukti ? (
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setModalImage(izin.bukti!)}
                          >
                            <Eye className='h-4 w-4 text-primary' />
                          </Button>
                        ) : (
                          <span className='text-muted-foreground'>–</span>
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        {izin.status === 'menunggu' && (
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
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Filter Kehadiran */}
          <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Input
              type='date'
              placeholder='Dari Tanggal'
              value={kehadiranStartDate}
              onChange={(e) => setKehadiranStartDate(e.target.value)}
            />
            <Input
              type='date'
              placeholder='Sampai Tanggal'
              value={kehadiranEndDate}
              onChange={(e) => setKehadiranEndDate(e.target.value)}
            />
            <Select
              value={String(kehadiranPageSize)}
              onValueChange={(v) => setKehadiranPageSize(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Limit' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5 / hal</SelectItem>
                <SelectItem value='10'>10 / hal</SelectItem>
                <SelectItem value='20'>20 / hal</SelectItem>
              </SelectContent>
            </Select>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setKehadiranPage((p) => Math.max(1, p - 1))}
                disabled={kehadiranPage <= 1}
              >
                Sebelumnya
              </Button>
              <span className='text-sm'>Hal {kehadiranPage}</span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setKehadiranPage((p) => p + 1)}
                disabled={
                  !data || kehadiranPage >= data.resultKehadiran.meta.totalPages
                }
              >
                Berikutnya
              </Button>
            </div>
          </div>

          {/* Tabel Kehadiran */}
          {isPending ? (
            <p className='py-8 text-center text-muted-foreground'>Loading...</p>
          ) : kehadiranList.length === 0 ? (
            <p className='py-8 text-center text-muted-foreground'>
              Tidak ada data kehadiran.
            </p>
          ) : (
            <div className='overflow-x-auto rounded-md border'>
              <Table>
                <TableHeader>
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
                  {kehadiranList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.tanggal).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.nip}</TableCell>
                      <TableCell>
                        {item.jamMasuk
                          ? new Date(item.jamMasuk).toLocaleString('id-ID')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {item.jamPulang
                          ? new Date(item.jamPulang).toLocaleString('id-ID')
                          : '-'}
                      </TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Modal Foto Bukti */}
      {modalImage && (
        <div
          className='fixed inset-0 -top-10 z-50 flex items-center justify-center bg-black/70 p-4'
          onClick={() => setModalImage(null)}
        >
          <div
            className='relative max-h-[80vh] max-w-3xl'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImage(null)}
              className='absolute -top-10 right-0 rounded-full bg-black/50 p-1.5 text-white'
              aria-label='Tutup'
            >
              ✕
            </button>
            <img
              src={modalImage}
              alt='Bukti izin'
              className='max-h-[80vh] w-auto max-w-full rounded-lg border-2 border-white bg-white object-contain p-2'
            />
          </div>
        </div>
      )}
    </Card>
  );
}
