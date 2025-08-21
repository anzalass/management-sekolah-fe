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
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';

type FormValues = {
  namaMapel: string;
  kelas: string;
  ruangKelas: string;
  namaGuru: string;
  nipGuru: string;
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
    formState: { errors }
  } = useForm<FormValues>();

  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!dataEdit;
  const { data: session } = useSession();
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
      setValue('namaGuru', session?.user?.nama);
      setValue('nipGuru', session?.user?.nip);

      const res = await fetch(
        isEdit
          ? `${process.env.NEXT_PUBLIC_API_URL}kelas-mapel/update/${dataEdit?.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}kelas-mapel/create`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          },
          body: JSON.stringify(data)
        }
      );

      if (!res.ok) throw new Error('Gagal menyimpan data');

      toast.success(
        isEdit ? 'Berhasil memperbarui data' : 'Berhasil menambah data'
      );
      fetchData();
      setOpenModal(null);
      reset();
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan');
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
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
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
