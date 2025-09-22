'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import api from '@/lib/api';

type FormValues = {
  tanggal: string;
  keterangan: string;
  bukti?: FileList;
};

type Props = {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  fetchData: () => void; // tambahkan ini
  dataIzin?: {
    id: number;
    tanggal: string;
    keterangan: string;
    buktiUrl?: string;
  } | null;
};

export default function ModalTambahIzin({
  openModal,
  setOpenModal,
  fetchData,
  dataIzin
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>();

  const [preview, setPreview] = useState<string | null>(null);
  const { data: session } = useSession();
  const buktiFile = watch('bukti');

  useEffect(() => {
    if (buktiFile && buktiFile.length > 0 && !dataIzin) {
      const file = buktiFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [buktiFile, dataIzin]);

  useEffect(() => {
    if (dataIzin) {
      reset({
        tanggal: dataIzin.tanggal,
        keterangan: dataIzin.keterangan
      });
    } else {
      reset();
      setPreview(null);
    }
  }, [dataIzin, reset]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('time', data.tanggal);
    formData.append('keterangan', data.keterangan);

    if (data.bukti && data.bukti[0]) {
      formData.append('bukti', data.bukti[0]);
    }

    try {
      setIsLoading(true);

      const endpoint = dataIzin
        ? `perizinan-guru/update/${dataIzin.id}`
        : `perizinan-guru/create`;

      const method = dataIzin ? api.put : api.post;

      await method(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success(
        dataIzin ? 'Izin berhasil diperbarui' : 'Izin berhasil diajukan'
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
          {dataIzin ? 'Edit Izin' : 'Form Pengajuan Izin'}
        </DialogTitle>
      </VisuallyHidden>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label htmlFor='tanggal'>Tanggal</label>
            <Input
              id='tanggal'
              type='date'
              {...register('tanggal', { required: 'Tanggal wajib diisi' })}
            />
            {errors.tanggal && (
              <p className='text-sm text-red-500'>{errors.tanggal.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='keterangan'>Keterangan</label>
            <Textarea
              id='keterangan'
              placeholder='Masukkan alasan izin'
              {...register('keterangan', {
                required: 'Keterangan wajib diisi'
              })}
            />
            {errors.keterangan && (
              <p className='text-sm text-red-500'>
                {errors.keterangan.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor='bukti'>Upload Bukti (Opsional)</label>
            <Input
              id='bukti'
              type='file'
              accept='image/*'
              {...register('bukti')}
            />

            {/* Preview hanya muncul saat mode POST */}
            {!dataIzin && preview && (
              <img
                src={preview}
                alt='Preview Bukti'
                className='mt-2 max-h-40 rounded border border-gray-300 object-contain'
              />
            )}
          </div>

          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? dataIzin
                  ? 'Menyimpan...'
                  : 'Mengirim...'
                : dataIzin
                  ? 'Simpan Perubahan'
                  : 'Ajukan Izin'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
