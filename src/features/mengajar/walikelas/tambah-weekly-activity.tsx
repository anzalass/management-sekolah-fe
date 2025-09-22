'use client';

import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

interface FormValues {
  content: string;
  waktu: string;
}

type Props = {
  idKelas: string;
};
export default function TambahWeeklyActivity({ idKelas }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { toggleTrigger } = useRenderTrigger();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  // drag-drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // agar bisa drag file
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

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      // Buat formData
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('waktu', data.waktu);
      formData.append('idKelas', idKelas);

      selectedFiles.forEach((file) => {
        formData.append('foto', file);
      });

      // Hit API backend langsung
      const res = await api.post('weekly-activity', formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      if (res.status === 201) {
        setSelectedFiles([]);
        setOpen(false);
        toggleTrigger();
        toast.success('Berhasil membuat weekly activity');
      }
    } catch (err) {
      console.error(err);
      alert('Error mengirim data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>Tambah Weekly Activity</Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Tambah Weekly Activity</DialogTitle>
          <DialogDescription>
            Isi detail aktivitas mingguan & upload foto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Content */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Deskripsi Aktivitas
            </label>
            <Textarea
              placeholder='Tulis aktivitas...'
              {...register('content', { required: 'Deskripsi wajib diisi' })}
            />
            {errors.content && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Waktu */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Waktu
            </label>
            <Input
              type='datetime-local'
              defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
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
            <label className='mb-1 block text-sm font-medium text-gray-700'>
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
              }}
            >
              Batal
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
