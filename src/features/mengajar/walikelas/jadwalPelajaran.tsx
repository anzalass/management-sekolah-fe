'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

type Jadwal = {
  id: string;
  idKelas: string;
  hari: string;
  namaMapel: string;
  jamMulai: string;
  jamSelesai: string;
};

type IDKelas = {
  idKelas: string;
};

export default function JadwalPelajaran({ idKelas }: IDKelas) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: jadwals = [], isLoading } = useQuery<Jadwal[]>({
    queryKey: ['jadwal', idKelas],
    queryFn: async () => {
      const res = await api.get(`jadwal/${idKelas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  const addJadwalMutation = useMutation({
    mutationFn: async (newJadwal: Omit<Jadwal, 'id'>) => {
      const res = await api.post('jadwal', newJadwal, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal', idKelas] });
      toast.success('Jadwal berhasil ditambahkan');
      setOpenModal(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menambahkan jadwal');
    }
  });

  const deleteJadwalMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`jadwal/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal', idKelas] });
      toast.success('Jadwal berhasil dihapus');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus jadwal');
    }
  });

  // Fetch semua mapel
  const [mapel, setMapel] = useState<{ id: string; nama: string }[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { register, handleSubmit, reset, control } = useForm<Jadwal>();

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const response = await api.get(`mapel`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        setMapel(response.data.result.data || []);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Gagal memuat mata pelajaran'
        );
      }
    };
    if (session?.user?.token) {
      fetchMapel();
    }
  }, [session?.user?.token]);

  const onSubmit = (data: Jadwal) => {
    addJadwalMutation.mutate({ ...data, idKelas });
  };

  // === FILTERING DI FRONTEND ===
  const [filterHari, setFilterHari] = useState('Semua');
  const [filterMapel, setFilterMapel] = useState('Semua');

  const filteredJadwals = useMemo(() => {
    return jadwals.filter((jadwal) => {
      const cocokHari = filterHari === 'Semua' || jadwal.hari === filterHari;
      const cocokMapel =
        filterMapel === 'Semua' || jadwal.namaMapel === filterMapel;
      return cocokHari && cocokMapel;
    });
  }, [jadwals, filterHari, filterMapel]);

  // Ambil daftar unik untuk filter
  const hariOptions = useMemo(() => {
    const hariSet = new Set(jadwals.map((j) => j.hari));
    return ['Semua', ...Array.from(hariSet).sort()];
  }, [jadwals]);

  const mapelOptions = useMemo(() => {
    const mapelSet = new Set(jadwals.map((j) => j.namaMapel));
    return ['Semua', ...Array.from(mapelSet).sort()];
  }, [jadwals]);

  return (
    <Card className='p-3 dark:text-white md:p-5'>
      <div className='mb-4 flex flex-row items-start justify-between gap-3 md:items-center'>
        <h1 className='text-base font-bold'>Jadwal Pelajaran</h1>
        <Button onClick={() => setOpenModal(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Jadwal
        </Button>
      </div>

      {/* Filter */}
      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-end md:gap-4'>
        <div className='w-full md:w-48'>
          <Label className='mb-1 text-xs'>Filter Hari</Label>
          <Select value={filterHari} onValueChange={setFilterHari}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hariOptions.map((hari) => (
                <SelectItem key={hari} value={hari}>
                  {hari}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='w-full md:w-48'>
          <Label className='mb-1 text-xs'>Filter Mapel</Label>
          <Select value={filterMapel} onValueChange={setFilterMapel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mapelOptions.map((mapel) => (
                <SelectItem key={mapel} value={mapel}>
                  {mapel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabel Jadwal */}
      <div className='overflow-x-auto rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead className='text-right'>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className='py-6 text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredJadwals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='py-6 text-center text-muted-foreground'
                >
                  Tidak ada jadwal ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredJadwals.map((jadwal) => (
                <TableRow key={jadwal.id}>
                  <TableCell className='font-medium'>
                    {jadwal.namaMapel}
                  </TableCell>
                  <TableCell>{jadwal.hari}</TableCell>
                  <TableCell>
                    {jadwal.jamMulai} - {jadwal.jamSelesai}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='destructive'
                      size='icon'
                      onClick={() => deleteJadwalMutation.mutate(jadwal.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Tambah Jadwal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className='dark:text-white'>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label>Hari</Label>
              <Controller
                name='hari'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih hari' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Senin'>Senin</SelectItem>
                      <SelectItem value='Selasa'>Selasa</SelectItem>
                      <SelectItem value='Rabu'>Rabu</SelectItem>
                      <SelectItem value='Kamis'>Kamis</SelectItem>
                      <SelectItem value='Jumat'>Jumat</SelectItem>
                      <SelectItem value='Sabtu'>Sabtu</SelectItem>
                      <SelectItem value='Minggu'>Minggu</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Nama Mapel</Label>
              <Controller
                name='namaMapel'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih mata pelajaran' />
                    </SelectTrigger>
                    <SelectContent>
                      {mapel.map((item) => (
                        <SelectItem key={item.id} value={item.nama}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <Label>Jam Mulai</Label>
                <Input
                  type='time'
                  {...register('jamMulai', { required: true })}
                />
              </div>
              <div>
                <Label>Jam Selesai</Label>
                <Input
                  type='time'
                  {...register('jamSelesai', { required: true })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit' disabled={addJadwalMutation.isPending}>
                {addJadwalMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
