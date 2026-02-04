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

const MAX_FILES = 15;
const MAX_FILE_SIZE = 300 * 1024; // 300 KB

export default function TambahWeeklyActivity({ idKelas }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);

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

  // =====================
  // DROPZONE VALIDATION
  // =====================
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileError(null);

      if (selectedFiles.length + acceptedFiles.length > MAX_FILES) {
        setFileError(`Maksimal ${MAX_FILES} foto`);
        return;
      }

      const invalidSize = acceptedFiles.find(
        (file) => file.size > MAX_FILE_SIZE
      );

      if (invalidSize) {
        setFileError(`Ukuran foto "${invalidSize.name}" melebihi 300 KB`);
        return;
      }

      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [selectedFiles]
  );

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

  // =====================
  // MUTATION + PROGRESS
  // =====================
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (selectedFiles.length === 0) {
        throw new Error('Foto wajib diupload');
      }

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
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        }
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success('Berhasil membuat weekly activity');
      queryClient.invalidateQueries({ queryKey: ['weekly-activity', idKelas] });
      setSelectedFiles([]);
      setUploadProgress(0);
      setOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Terjadi kesalahan');
      setUploadProgress(0);
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='flex min-h-[50px] w-full flex-col'>
          <Activity size={16} className='mb-2' />
          Weekly Activity
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[80vh] max-w-lg overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Tambah Weekly Activity</DialogTitle>
          <DialogDescription>
            Isi detail aktivitas mingguan & upload foto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Judul */}
          <div>
            <label className='text-sm font-medium'>Judul</label>
            <Input
              {...register('judul', {
                required: 'Judul wajib diisi',
                minLength: {
                  value: 5,
                  message: 'Judul minimal 5 karakter'
                }
              })}
            />
            {errors.judul && (
              <p className='text-sm text-red-500'>{errors.judul.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className='text-sm font-medium'>Deskripsi</label>
            <Controller
              name='content'
              control={control}
              rules={{
                required: 'Deskripsi wajib diisi',
                minLength: {
                  value: 10,
                  message: 'Minimal 10 karakter'
                }
              }}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className='text-sm text-red-500'>{errors.content.message}</p>
            )}
          </div>

          {/* Waktu */}
          <div>
            <label className='text-sm font-medium'>Waktu</label>
            <Input
              type='datetime-local'
              {...register('waktu', { required: 'Waktu wajib diisi' })}
            />
          </div>

          {/* Upload Foto */}
          <div>
            <label className='text-sm font-medium'>Upload Foto</label>
            <div
              {...getRootProps()}
              className='cursor-pointer rounded-lg border-2 border-dashed p-4 text-center'
            >
              <input {...getInputProps()} />
              <p className='text-gray-500'>
                Maks {MAX_FILES} foto • Maks 300 KB / foto
              </p>
            </div>

            {fileError && (
              <p className='mt-1 text-sm text-red-500'>{fileError}</p>
            )}

            <p className='mt-1 text-xs text-gray-500'>
              Foto terlalu besar?{' '}
              <a
                href='https://imagecompressor.11zon.com/id/compress-jpeg/compress-jpeg-to-100kb'
                target='_blank'
                className='text-blue-600 underline'
              >
                Resize di sini
              </a>
            </p>

            {selectedFiles.length > 0 && (
              <div className='mt-3 grid grid-cols-3 gap-3'>
                {selectedFiles.map((file, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={URL.createObjectURL(file)}
                      className='h-24 w-full rounded object-cover'
                    />
                    <button
                      type='button'
                      className='absolute right-1 top-1 rounded bg-red-500 px-1 text-xs text-white'
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {mutation.isPending && (
            <div className='w-full rounded bg-gray-200'>
              <div
                className='h-2 rounded bg-blue-600 transition-all'
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Actions */}
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type='submit' disabled={mutation.isPending}>
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
