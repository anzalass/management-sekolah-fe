'use client';

import React, { useState } from 'react';
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

  // ✅ Fetch jadwal
  const { data: jadwals, isLoading } = useQuery<Jadwal[]>({
    queryKey: ['jadwal', idKelas],
    queryFn: async () => {
      const res = await api.get(`jadwal/${idKelas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  // ✅ Tambah jadwal
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

  // ✅ Hapus jadwal
  const deleteJadwalMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`jadwal/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
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

  // Modal tambah
  const [openModal, setOpenModal] = useState(false);
  const { register, handleSubmit, reset, control } = useForm<Jadwal>();

  const onSubmit = (data: Jadwal) => {
    addJadwalMutation.mutate({
      ...data,
      idKelas
    });
  };

  return (
    <Card className='p-5 dark:text-white'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-base font-bold'>Jadwal Pelajaran</h1>
        <Button onClick={() => setOpenModal(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Tambah Jadwal
        </Button>
      </div>

      {/* List Jadwal */}
      <div className='space-y-3'>
        {isLoading && <p>Loading...</p>}
        {jadwals?.map((jadwal) => (
          <Card
            key={jadwal.id}
            className='flex items-center justify-between rounded-xl p-4 shadow-md'
          >
            <div>
              <h2 className='text-base font-semibold'>{jadwal.namaMapel}</h2>
              <p className='text-sm'>
                {jadwal.hari} • {jadwal.jamMulai} - {jadwal.jamSelesai}
              </p>
            </div>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => deleteJadwalMutation.mutate(jadwal.id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Jadwal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className='dark:text-white'>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
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
              <Input
                {...register('namaMapel', { required: true })}
                placeholder='Matematika'
              />
            </div>

            <div className='grid grid-cols-2 gap-2'>
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
