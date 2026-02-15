'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

type Props = {
  openModal: boolean;
  fetchData: () => void;
  setOpenModal: (val: boolean) => void;
  dataEdit?: FormValues | null;
};

export type FormValues = {
  id?: string;
  nipGuru: string;
  kelas: string;
  jamMulai: string;
  jamSelesai: string;
  namaMapel: string;
  hari: string;
  ruang: string;
};

export default function ModalTambahJadwal({
  openModal,
  setOpenModal,
  fetchData,
  dataEdit
}: Props) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      nipGuru: session?.user?.nip,
      kelas: '',
      jamMulai: '',
      jamSelesai: '',
      namaMapel: '',
      hari: '',
      ruang: ''
    }
  });

  // isi form saat edit
  useEffect(() => {
    if (dataEdit) reset(dataEdit);
  }, [dataEdit, reset]);

  // =========================
  // SUBMIT
  // =========================
  const onSubmit = async (data: FormValues) => {
    if (data.jamSelesai <= data.jamMulai) {
      toast.error('Jam selesai tidak boleh lebih kecil dari jam mulai');
      return;
    }

    setIsLoading(true);
    const isEdit = Boolean(dataEdit?.id);

    try {
      const endpoint = isEdit
        ? `jadwal-mengajar/update/${dataEdit?.id}`
        : `jadwal-mengajar/create`;

      const method = isEdit ? api.put : api.post;

      await method(endpoint, data, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success(
        isEdit ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil ditambahkan'
      );

      fetchData();
      setOpenModal(false);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // DATA SELECT
  // =========================
  const { data: mapelList } = useQuery({
    queryKey: ['mapel-input'],
    queryFn: async () => (await api.get('mapel-input')).data.result
  });

  const { data: kelasList } = useQuery({
    queryKey: ['kelas-input'],
    queryFn: async () =>
      (
        await api.get('list-kelas-input', {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        })
      ).data
  });

  const { data: ruangList } = useQuery({
    queryKey: ['ruang-input'],
    queryFn: async () =>
      (
        await api.get('ruang2', {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        })
      ).data.data
  });

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <VisuallyHidden>
        <DialogTitle>{dataEdit ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
      </VisuallyHidden>

      <DialogContent>
        <DialogHeader />

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* JAM MULAI */}
          <div>
            <label>Jam Mulai</label>
            <Input
              type='time'
              {...register('jamMulai', { required: 'Jam mulai wajib diisi' })}
            />
            {errors.jamMulai && (
              <p className='text-sm text-red-500'>{errors.jamMulai.message}</p>
            )}
          </div>

          {/* JAM SELESAI */}
          <div>
            <label>Jam Selesai</label>
            <Input
              type='time'
              {...register('jamSelesai', {
                required: 'Jam selesai wajib diisi',
                validate: (val) =>
                  val > watch('jamMulai') ||
                  'Jam selesai harus lebih besar dari jam mulai'
              })}
            />
            {errors.jamSelesai && (
              <p className='text-sm text-red-500'>
                {errors.jamSelesai.message}
              </p>
            )}
          </div>

          {/* MAPEL */}
          <Controller
            name='namaMapel'
            control={control}
            rules={{ required: 'Mata pelajaran wajib dipilih' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih Mata Pelajaran' />
                </SelectTrigger>
                <SelectContent>
                  {mapelList?.map((m: any) => (
                    <SelectItem key={m.id} value={m.nama}>
                      {m.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.namaMapel && (
            <p className='text-sm text-red-500'>{errors.namaMapel.message}</p>
          )}

          {/* RUANG */}
          <Controller
            name='ruang'
            control={control}
            rules={{ required: 'Ruangan wajib dipilih' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih Ruangan' />
                </SelectTrigger>
                <SelectContent>
                  {ruangList?.map((r: any) => (
                    <SelectItem key={r.id} value={r.nama}>
                      {r.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.ruang && (
            <p className='text-sm text-red-500'>{errors.ruang.message}</p>
          )}

          {/* KELAS */}
          <Controller
            name='kelas'
            control={control}
            rules={{ required: 'Kelas wajib dipilih' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih Kelas' />
                </SelectTrigger>
                <SelectContent>
                  {kelasList?.map((k: any) => (
                    <SelectItem key={k.id} value={k.namaKelas}>
                      {k.namaKelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.kelas && (
            <p className='text-sm text-red-500'>{errors.kelas.message}</p>
          )}

          {/* HARI */}
          <Controller
            name='hari'
            control={control}
            rules={{ required: 'Hari wajib dipilih' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih Hari' />
                </SelectTrigger>
                <SelectContent>
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(
                    (h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.hari && (
            <p className='text-sm text-red-500'>{errors.hari.message}</p>
          )}

          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? 'Menyimpan...'
                : dataEdit
                  ? 'Simpan Perubahan'
                  : 'Simpan Jadwal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
