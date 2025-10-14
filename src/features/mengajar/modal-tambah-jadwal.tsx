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
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import api from '@/lib/api';

type Props = {
  openModal: boolean;
  fetchData: () => void; // tambahkan ini
  setOpenModal: (val: boolean) => void;
  dataEdit?: FormValues | null; // ← tambahkan untuk edit
};

export type FormValues = {
  id?: string; // ← penting untuk edit
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const [isLoading, setIsLoading] = useState(false);

  // 🔁 Jika dataEdit tersedia, isi form otomatis
  useEffect(() => {
    if (dataEdit) {
      reset(dataEdit);
    }
  }, [dataEdit, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const isEdit = Boolean(dataEdit?.id);

    try {
      const endpoint = isEdit
        ? `jadwal-mengajar/update/${dataEdit?.id}`
        : `jadwal-mengajar/create`;

      const method = isEdit ? api.put : api.post;

      await method(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
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

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <VisuallyHidden>
        <DialogTitle>
          {dataEdit ? 'Edit Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
        </DialogTitle>
      </VisuallyHidden>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 dark:text-white'
        >
          <div>
            <label htmlFor='jamMulai'>Jam Mulai</label>
            <Input
              type='time'
              id='jamMulai'
              {...register('jamMulai', { required: 'Jam mulai wajib diisi' })}
            />
            {errors.jamMulai && (
              <p className='text-sm text-red-500'>{errors.jamMulai.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='jamSelesai'>Jam Selesai</label>
            <Input
              type='time'
              id='jamSelesai'
              {...register('jamSelesai', {
                required: 'Jam selesai wajib diisi'
              })}
            />
            {errors.jamSelesai && (
              <p className='text-sm text-red-500'>
                {errors.jamSelesai.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor='namaMapel'>Nama Mapel</label>
            <Input
              id='namaMapel'
              placeholder='Contoh: Matematika'
              {...register('namaMapel', { required: 'Nama mapel wajib diisi' })}
            />
            {errors.namaMapel && (
              <p className='text-sm text-red-500'>{errors.namaMapel.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='kelas'>Kelas</label>
            <Input
              id='kelas'
              placeholder='Contoh: Matematika'
              {...register('kelas', { required: 'Nama kelas wajib diisi' })}
            />
            {errors.namaMapel && (
              <p className='text-sm text-red-500'>{errors.namaMapel.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='hari'
              className='mb-1 block text-sm font-medium text-gray-700'
            >
              Hari
            </label>
            <Select
              onValueChange={(val) => setValue('hari', val)}
              value={watch('hari')}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih hari' />
              </SelectTrigger>
              <SelectContent>
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(
                  (hari) => (
                    <SelectItem key={hari} value={hari}>
                      {hari}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {errors.hari && (
              <p className='text-sm text-red-500'>{errors.hari.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='ruang'>Ruang</label>
            <Input
              id='ruang'
              placeholder='Contoh: Ruang 01'
              {...register('ruang', { required: 'Ruang wajib diisi' })}
            />
            {errors.ruang && (
              <p className='text-sm text-red-500'>{errors.ruang.message}</p>
            )}
          </div>

          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? dataEdit
                  ? 'Menyimpan...'
                  : 'Mengirim...'
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
