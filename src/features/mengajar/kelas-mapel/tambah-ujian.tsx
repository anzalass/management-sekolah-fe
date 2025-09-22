'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { toast } from 'sonner';

interface FormValues {
  namaUjian: string;
  deadline: string; // format ISO string
  iframeUrl: string;
}

type Props = {
  idKelasMapel: string;
};

export default function TambahUjian({ idKelasMapel }: Props) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post(`ujian-iframe`, {
        idKelasMapel: idKelasMapel,
        nama: data.namaUjian,
        deadline: data.deadline,
        iframe: data.deadline
      });
      reset();
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>Tambah Ujian</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Tambah Ujian</DialogTitle>
          <DialogDescription>
            Masukkan detail ujian di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Nama Ujian */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Nama Ujian
            </label>
            <Input
              type='text'
              placeholder='Contoh: Ujian Matematika Semester 1'
              {...register('namaUjian', { required: 'Nama ujian wajib diisi' })}
            />
            {errors.namaUjian && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.namaUjian.message}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Deadline Ujian
            </label>
            <Input
              type='datetime-local'
              {...register('deadline', { required: 'Deadline wajib diisi' })}
            />
            {errors.deadline && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Link Google Form */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Link Google Form
            </label>
            <Input
              type='url'
              placeholder='https://docs.google.com/forms/...'
              {...register('iframeUrl', { required: 'Link wajib diisi' })}
            />
            {errors.iframeUrl && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.iframeUrl.message}
              </p>
            )}
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type='submit'>Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
