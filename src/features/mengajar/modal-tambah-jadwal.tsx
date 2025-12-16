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
import { useQuery } from '@tanstack/react-query';

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

  const { data: mapelList } = useQuery({
    queryKey: ['mapel-input'],
    queryFn: async () => {
      const res = await api.get('mapel-input');
      return res.data.result;
    }
  });

  const { data: kelasList } = useQuery({
    queryKey: ['list-kelas-input'],
    queryFn: async () => {
      const res = await api.get('list-kelas-input', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data;
    }
  });

  const { data: ruangList } = useQuery({
    queryKey: ['ruang2'],
    queryFn: async () => {
      const res = await api.get('ruang2', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    }
  });

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
            <Select
              onValueChange={(val) => setValue('namaMapel', val)}
              defaultValue={dataEdit?.namaMapel || ''}
            >
              <SelectTrigger className='w-full'>
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
            {errors.namaMapel && (
              <p className='text-sm text-red-500'>{errors.namaMapel.message}</p>
            )}
          </div>

          <div>
            <Select
              onValueChange={(val) => setValue('ruang', val)}
              defaultValue={dataEdit?.ruang || ''}
            >
              <SelectTrigger className='w-full'>
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
            {errors.ruang && (
              <p className='text-sm text-red-500'>{errors.ruang.message}</p>
            )}
          </div>

          {/* Select Kelas */}
          <div>
            <Select
              onValueChange={(val) => setValue('kelas', val)}
              defaultValue={dataEdit?.kelas || ''}
            >
              <SelectTrigger className='w-full'>
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
            {errors.kelas && (
              <p className='text-sm text-red-500'>{errors.kelas.message}</p>
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
