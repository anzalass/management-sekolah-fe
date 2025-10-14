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
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

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
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  // 👉 definisi mutation react-query
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return await api.post(
        `ujian-iframe`,
        {
          idKelasMapel,
          nama: data.namaUjian,
          deadline: data.deadline,
          iframe: data.iframeUrl
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
    },
    onSuccess: () => {
      toast.success('Ujian berhasil ditambahkan');
      reset();
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['kelasMapel', idKelasMapel]
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan ujian');
    }
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>Tambah Ujian</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>Tambah Ujian</DialogTitle>
          <DialogDescription>
            Masukkan detail ujian di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Nama Ujian */}
          <div>
            <p className='block text-sm font-medium dark:text-white'>
              Nama Ujian
            </p>
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
            <p className='block text-sm font-medium dark:text-white'>
              Deadline Ujian
            </p>
            <Input
              className='dark:text-white placeholder:dark:text-white'
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
            <p className='block text-sm font-medium dark:text-white'>
              Link Google Form
            </p>
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
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
