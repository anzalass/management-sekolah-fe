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
import api from '@/lib/api';

type FormValues = {
  namaMapel: string;
  kelas: string;
  ruangKelas: string;
  namaGuru: string;
  nipGuru: string;
  fotoBanner: FileList; // tambahan
};

type Props = {
  openModal: string | null;
  fetchData: () => void;
  setOpenModal: (val: string | null) => void;
  dataEdit?: {
    id: string;
    namaMapel: string;
    kelas: string;
    ruangKelas: string;
    fotoBanner?: string;
  } | null;
};

export default function ModalTambahKelasMapel({
  openModal,
  setOpenModal,
  dataEdit,
  fetchData
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>();

  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!dataEdit;
  const { data: session } = useSession();

  const watchFile = watch('fotoBanner');

  useEffect(() => {
    if (dataEdit) {
      setValue('namaMapel', dataEdit.namaMapel);
      setValue('kelas', dataEdit.kelas);
      setValue('ruangKelas', dataEdit.ruangKelas);
    } else {
      reset();
    }
  }, [dataEdit, setValue, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!session?.user) {
      return;
    }
    setIsLoading(true);

    try {
      setValue('namaGuru', session.user.nama);
      setValue('nipGuru', session.user.nip);

      const formData = new FormData();
      formData.append('namaMapel', data.namaMapel);
      formData.append('kelas', data.kelas);
      formData.append('ruangKelas', data.ruangKelas);
      formData.append('namaGuru', session.user.nama);
      formData.append('nipGuru', session.user.nip);

      if (data.fotoBanner && data.fotoBanner[0]) {
        formData.append('banner', data.fotoBanner[0]);
      }

      const endpoint = isEdit
        ? `kelas-mapel/update/${dataEdit?.id}`
        : 'kelas-mapel/create';

      const method = isEdit ? api.put : api.post;

      await method(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success(
        isEdit ? 'Berhasil memperbarui data' : 'Berhasil menambah data'
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
      open={openModal === 'mapel'}
      onOpenChange={() => setOpenModal(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Kelas Mapel' : 'Tambah Kelas Mapel'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-3'
          encType='multipart/form-data'
        >
          <div>
            <Input
              placeholder='Nama Mapel'
              {...register('namaMapel', { required: 'Nama mapel wajib diisi' })}
            />
            {errors.namaMapel && (
              <p className='text-sm text-red-500'>{errors.namaMapel.message}</p>
            )}
          </div>
          <div>
            <Input
              placeholder='Kelas'
              {...register('kelas', { required: 'Kelas wajib diisi' })}
            />
            {errors.kelas && (
              <p className='text-sm text-red-500'>{errors.kelas.message}</p>
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
          <div>
            <Input type='file' accept='image/*' {...register('fotoBanner')} />
            {watchFile?.length > 0 && (
              <img
                src={URL.createObjectURL(watchFile[0])}
                alt='Preview Banner'
                className='mt-2 h-24 rounded-md object-cover'
              />
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
