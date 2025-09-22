'use client';

import React, { useEffect, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

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
  const [jadwals, setJadwals] = useState<Jadwal[]>([]);

  const getJadwalPelajaran = async () => {
    try {
      const res = await api.get(`jadwal/${idKelas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setJadwals(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getJadwalPelajaran();
  }, [idKelas]);

  const [openModal, setOpenModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<Jadwal>();

  const onSubmit = async (data: Jadwal) => {
    try {
      const newJadwal = {
        ...data,
        idKelas: idKelas
      };
      await api.post('jadwal', newJadwal, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setJadwals([...jadwals, newJadwal]);
      reset();
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDelete = (id: string) => {
    setJadwals(jadwals.filter((j) => j.id !== id));
  };

  return (
    <div className=''>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Jadwal Pelajaran</h1>
        <Button onClick={() => setOpenModal(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Tambah Jadwal
        </Button>
      </div>

      {/* List Jadwal */}
      <div className='space-y-3'>
        {jadwals.map((jadwal, i) => (
          <Card
            key={i}
            className='flex items-center justify-between rounded-xl p-4 shadow-md'
          >
            <div>
              <h2 className='font-semibold'>{jadwal.namaMapel}</h2>
              <p className='text-sm text-gray-600'>
                {jadwal.hari} • {jadwal.jamMulai} - {jadwal.jamSelesai}
              </p>
            </div>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => handleDelete(jadwal.id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Jadwal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
            <div>
              <Label>Hari</Label>
              <Input
                {...register('hari', { required: true })}
                placeholder='Senin'
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
              <Button type='submit'>Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
