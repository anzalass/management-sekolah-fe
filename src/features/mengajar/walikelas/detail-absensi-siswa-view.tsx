'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type KehadiranSiswa = {
  id: string;
  namaSiswa: string;
  nisSiswa: string;
  waktu: string; // ISO string
  keterangan: string;
};

type FormData = {
  tanggal: string;
  keterangan: string;
};

interface Props {
  idKelas: string;
  idSiswa: string;
}

export default function DetailAbsensiSiswaView({ idKelas, idSiswa }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    defaultValues: { tanggal: '', keterangan: '' }
  });
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // filter
  const [filterDate, setFilterDate] = useState('');

  // fetch absensi
  const { data: dataKehadiran = [], isLoading } = useQuery<KehadiranSiswa[]>({
    queryKey: ['absensi-siswa', idKelas, idSiswa],
    queryFn: async () => {
      const res = await api.get(`absensi-siswa/${idKelas}/${idSiswa}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data;
    },
    enabled: !!idKelas && !!idSiswa // hanya jalan kalau ada param
  });

  // mutation tambah absen
  const addAbsensi = useMutation({
    mutationFn: async (values: FormData) => {
      const waktuISO = new Date(values.tanggal).toISOString();
      await api.post(
        'kehadiran-manual',
        { idKelas, idSiswa, waktu: waktuISO, keterangan: values.keterangan },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Absen berhasil ditambahkan');
      queryClient.invalidateQueries({
        queryKey: ['absensi-siswa', idKelas, idSiswa]
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Gagal menambahkan absen');
    }
  });

  // mutation hapus absen
  const deleteAbsensi = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`kehadiran-manual/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Data absen berhasil dihapus');
      queryClient.invalidateQueries({
        queryKey: ['absensi-siswa', idKelas, idSiswa]
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Gagal menghapus absen');
    }
  });

  // filter di FE
  const filteredData = dataKehadiran.filter((item) => {
    if (!filterDate) return true;
    const itemDate = new Date(item.waktu).toISOString().slice(0, 10); // yyyy-mm-dd
    return itemDate === filterDate;
  });

  return (
    <div className='space-y-6 p-4'>
      {/* filter */}
      <div className='flex items-center justify-between'>
        <Input
          type='date'
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className='w-52'
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Absen Manual</Button>
          </DialogTrigger>
          <DialogContent className='dark:text-white sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Tambah Absen Manual</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit((values) =>
                addAbsensi.mutate(values)
              )}
              className='space-y-4'
              noValidate
            >
              {/* Tanggal */}
              <div>
                <label className='mb-1 block text-sm'>Tanggal</label>
                <Input
                  type='datetime-local'
                  {...form.register('tanggal', {
                    required: 'Tanggal wajib diisi'
                  })}
                />
                {form.formState.errors.tanggal && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.tanggal.message}
                  </p>
                )}
              </div>

              {/* Keterangan */}
              <div>
                <label className='mb-1 block text-sm'>Keterangan</label>
                <Controller
                  name='keterangan'
                  control={form.control}
                  rules={{ required: 'Keterangan wajib dipilih' }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Pilih keterangan' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Hadir'>Hadir</SelectItem>
                        <SelectItem value='Izin'>Izin</SelectItem>
                        <SelectItem value='Tanpa Keterangan'>
                          Tanpa Keterangan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.keterangan && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.keterangan.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type='submit' disabled={addAbsensi.isPending}>
                  {addAbsensi.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel absensi */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal & Jam</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>NIS</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead className='text-center'>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className='py-4 text-center'>
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredData?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='py-4 text-center'>
                Tidak ada data kehadiran
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {new Date(item.waktu).toLocaleDateString('id-ID', {
                    weekday: 'long'
                  })}
                  , {new Date(item.waktu).toLocaleDateString('id-ID')}{' '}
                  {new Date(item.waktu).toLocaleTimeString('id-ID')}
                </TableCell>
                <TableCell>{item.namaSiswa}</TableCell>
                <TableCell>{item.nisSiswa}</TableCell>
                <TableCell>{item.keterangan}</TableCell>
                <TableCell className='text-center'>
                  <Button
                    size='icon'
                    variant='destructive'
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus data absen ini?')) {
                        deleteAbsensi.mutate(item.id);
                      }
                    }}
                    disabled={deleteAbsensi.isPending}
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
  );
}
