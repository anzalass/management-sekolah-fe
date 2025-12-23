'use client';

import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import RichTextEditor from '@/features/texteditor/textEditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity } from 'lucide-react';

interface FormValues {
  judul: string;
  content: string;
  waktu: string;
}

type Props = {
  idKelas: string;
};

export default function TambahWeeklyActivity({ idKelas }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      judul: '',
      content: '',
      waktu: format(new Date(), "yyyy-MM-dd'T'HH:mm")
    }
  });

  // drag-drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': []
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  // --- React Query mutation
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append('judul', data.judul);
      formData.append('content', data.content);
      formData.append('waktu', data.waktu);
      formData.append('idKelas', idKelas);

      selectedFiles.forEach((file) => {
        formData.append('foto', file);
      });

      const res = await api.post('weekly-activity', formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Berhasil membuat weekly activity');
      queryClient.invalidateQueries({ queryKey: ['weekly-activity', idKelas] });
      setSelectedFiles([]);
      setOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Terjadi kesalahan saat mengirim data');
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className=''>
          <Button
            variant='default'
            className='flex min-h-[50px] w-full flex-col text-xs lg:text-base xl:min-h-[120px]'
          >
            <Activity size={16} className='mb-2' />
            Weekly Activity
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='max-h-[80vh] max-w-lg overflow-y-auto dark:text-white'>
        <DialogHeader>
          <DialogTitle>Tambah Weekly Activity</DialogTitle>
          <DialogDescription>
            Isi detail aktivitas mingguan & upload foto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Judul */}
          <div>
            <label className='block text-sm font-medium'>Judul</label>
            <Input
              type='text'
              {...register('judul', { required: 'Judul wajib diisi' })}
            />
            {errors.judul && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.judul.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className='block text-sm font-medium'>
              Deskripsi Aktivitas
            </label>
            <Controller
              name='content'
              control={control}
              rules={{ required: 'Deskripsi wajib diisi' }}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Waktu */}
          <div>
            <label className='block text-sm font-medium'>Waktu</label>
            <Input
              type='datetime-local'
              {...register('waktu', { required: 'Waktu wajib diisi' })}
            />
            {errors.waktu && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.waktu.message}
              </p>
            )}
          </div>

          {/* Upload Foto */}
          <div>
            <label className='mb-1 block text-sm font-medium'>
              Upload Foto
            </label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className='text-blue-500'>Drop foto disini...</p>
              ) : (
                <p className='text-gray-500'>
                  Klik / drag & drop untuk upload foto
                </p>
              )}
            </div>
            {selectedFiles.length > 0 && (
              <div className='mt-3 grid grid-cols-3 gap-3'>
                {selectedFiles.map((file, index) => (
                  <div key={index} className='group relative'>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className='h-24 w-full rounded-lg border object-cover'
                    />
                    <button
                      type='button'
                      className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-xs text-white opacity-80 hover:opacity-100'
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setSelectedFiles([]);
                setOpen(false);
                reset();
              }}
            >
              Batal
            </Button>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
