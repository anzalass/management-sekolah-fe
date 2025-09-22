'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import api from '@/lib/api';

type FormValues = {
  nama: string;
  namaGuru: string;
  nipGuru: string;
  ruangKelas: string;
  banner?: FileList; // file input
};

type Props = {
  openModal: string | null;
  fetchData: () => void;
  setOpenModal: (val: string | null) => void;
  dataEdit?: {
    id: string;
    nama: string;
    ruangKelas: string;
    bannerUrl?: string;
  } | null;
};

export default function ModalTambahKelas({
  openModal,
  setOpenModal,
  dataEdit,
  fetchData
}: Props) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!dataEdit;

  useEffect(() => {
    if (dataEdit) {
      setValue('nama', dataEdit.nama);
      setValue('ruangKelas', dataEdit.ruangKelas);
    } else {
      reset();
    }
  }, [dataEdit, setValue, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    if (!session?.user) return;

    try {
      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('ruangKelas', data.ruangKelas);
      formData.append('namaGuru', session.user.nama);
      formData.append('nipGuru', session.user.nip);

      if (data.banner && data.banner[0]) {
        formData.append('banner', data.banner[0]);
      }

      const endpoint = isEdit
        ? `kelas-walikelas/update/${dataEdit?.id}`
        : 'kelas-walikelas/create';

      const method = isEdit ? api.put : api.post;

      await method(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success(
        isEdit ? 'Kelas berhasil diperbarui' : 'Kelas berhasil ditambahkan'
      );
      fetchData();
      setOpenModal(null);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={openModal === 'kelas'}
      onOpenChange={() => setOpenModal(null)}
    >
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{isEdit ? 'Edit Kelas' : 'Tambah Kelas'}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          <div>
            <Input
              placeholder='Nama Kelas'
              {...register('nama', { required: 'Nama kelas wajib diisi' })}
            />
            {errors.nama && (
              <p className='text-sm text-red-500'>{errors.nama.message}</p>
            )}
          </div>
          <div>
            <Input
              placeholder='Ruangan'
              {...register('ruangKelas', { required: 'Ruangan wajib diisi' })}
            />
            {errors.ruangKelas && (
              <p className='text-sm text-red-500'>
                {errors.ruangKelas.message}
              </p>
            )}
          </div>
          {/* Input Banner File */}
          <div>
            <Input type='file' accept='image/*' {...register('banner')} />
            {isEdit && dataEdit?.bannerUrl && (
              <p className='mt-1 text-xs text-muted-foreground'>
                Banner saat ini sudah ada (akan diganti jika upload baru).
              </p>
            )}
          </div>
          <div className='flex justify-end'>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? 'Menyimpan...'
                  : 'Mengirim...'
                : isEdit
                  ? 'Simpan Perubahan'
                  : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
