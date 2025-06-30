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
  nama: string;
  ruangKelas: string;
};

type Props = {
  openModal: string | null;
  fetchData: () => void;

  setOpenModal: (val: string | null) => void;
  dataEdit?: { id: string; nama: string; ruangKelas: string } | null;
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

  // Isi form otomatis jika edit
  useEffect(() => {
    if (dataEdit) {
      setValue('nama', dataEdit.nama);
      setValue('ruangKelas', dataEdit.ruangKelas);
    } else {
      reset(); // reset saat tambah
    }
  }, [dataEdit, setValue, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        isEdit
          ? `${API}kelas-walikelas/update/${dataEdit?.id}`
          : `${API}kelas-walikelas/create`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) throw new Error('Gagal menyimpan kelas');

      toast.success(
        isEdit ? 'Kelas berhasil diperbarui' : 'Kelas berhasil ditambahkan'
      );
      fetchData();
      setOpenModal(null);
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan saat menyimpan');
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
          <DialogTitle>{isEdit ? 'Edit Kelas' : 'Tambah Kelas'}</DialogTitle>
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
