'use client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Trash2,
  SearchIcon,
  CalendarIcon,
  Clock,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DialogTitle } from '@radix-ui/react-dialog';

type JanjiTemu = {
  id: string;
  waktu: string;
  status: string;
  deskripsi: string;
  siswaNama: string;
  siswaNis: string;
  guruNama: string;
};

type FormData = {
  deskripsi: string;
  guruId: string;
  waktu: string;
};

export default function JanjiTemuView() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: { deskripsi: '', guruId: '', waktu: '' }
  });

  // Fetch guru list
  // Fetch guru list
  const {
    data: guruList,
    isLoading: loadingGuru,
    error: guruError
  } = useQuery({
    queryKey: ['guruList'],
    queryFn: async () => {
      const res = await api.get('user/get-all-guru', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.result.data;
    },
    enabled: !!session?.user?.token
  });

  // Fetch janji temu siswa
  const {
    data: janjiTemuList,
    isLoading: loadingJanji,
    error: janjiError
  } = useQuery<JanjiTemu[]>({
    queryKey: ['janjiTemuSiswa'],
    queryFn: async () => {
      const res = await api.get('janji-temu-siswa', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  // Mutation create janji temu
  const createJanjiTemuMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await api.post(
        'janji-temu',
        {
          idSiswa: session?.user?.idGuru,
          idGuru: data.guruId,
          waktu: data.waktu,
          status: 'menunggu',
          deskripsi: data.deskripsi
        },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Berhasil membuat janji temu');
      reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['janjiTemuSiswa'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal membuat janji temu');
    }
  });

  // Mutation delete janji temu
  const deleteJanjiTemuMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`janji-temu/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Berhasil menghapus janji temu');
      queryClient.invalidateQueries({ queryKey: ['janjiTemuSiswa'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Gagal menghapus janji temu'
      );
    }
  });

  const onSubmit = (data: FormData) => createJanjiTemuMutation.mutate(data);
  const handleDelete = (id: string) => deleteJanjiTemuMutation.mutate(id);
  const resetFilter = () => {
    setSearch('');
    setFilterTanggal('');
  };

  const filteredData =
    janjiTemuList
      ?.filter((item) =>
        item.deskripsi.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) => {
        if (!filterTanggal) return true;
        const dateOnly = new Date(item.waktu).toISOString().split('T')[0];
        return dateOnly === filterTanggal;
      }) || [];

  return (
    <div className='mx-auto space-y-2'>
      <NavbarSiswa title='Janji Temu' />
      <BottomNav />

      <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='flex gap-1 p-4'>
              <Plus size={16} /> Tambah Janji Temu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <VisuallyHidden>
              <DialogTitle>Tambah Janji Temu</DialogTitle>
            </VisuallyHidden>

            <DialogHeader>
              <Label>Form Janji Temu</Label>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  {...register('deskripsi', { required: true })}
                  placeholder='Deskripsi janji temu'
                />
              </div>
              <div>
                <Label>Guru</Label>
                <Controller
                  name='guruId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className='w-full rounded border px-2 py-1'
                    >
                      <option value=''>-- Pilih Guru --</option>
                      {guruList?.map((guru: any) => (
                        <option key={guru.id} value={guru.id}>
                          {guru.nama}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div>
                <Label>Waktu</Label>
                <Input
                  type='datetime-local'
                  {...register('waktu', { required: true })}
                />
              </div>
              <div className='flex justify-end'>
                <Button type='submit'>Tambahkan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='relative w-full'>
            <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Cari deskripsi...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='relative w-full sm:max-w-xs'>
            <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              type='date'
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button onClick={resetFilter}>Reset</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Card key={item.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <p className='text-lg font-bold'>
                  {new Date(item?.waktu).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <div className='flex items-center gap-2'>
                  {item.status === 'disetujui' && (
                    <CheckCircle2 className='text-green-600' size={20} />
                  )}
                  {item.status === 'ditolak' && (
                    <XCircle className='text-red-600' size={20} />
                  )}
                  {item.status === 'menunggu' && (
                    <Clock className='text-yellow-500' size={20} />
                  )}
                  <span className='text-sm capitalize'>{item.status}</span>
                </div>
              </div>
              <div className='mt-2 space-y-2 text-sm text-muted-foreground'>
                <p>{item.deskripsi}</p>
                <p>
                  <span className='font-medium'>Siswa: </span>
                  {item.siswaNama} ({item.siswaNis})
                </p>
                <p>
                  <span className='font-medium'>Guru: </span>
                  {item.guruNama}
                </p>
              </div>
              {item.status === 'menunggu' && (
                <div className='mt-4 flex justify-end'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(item.id)}
                    className='flex items-center gap-1'
                  >
                    <Trash2 size={16} /> Hapus
                  </Button>
                </div>
              )}
            </Card>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada data ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
