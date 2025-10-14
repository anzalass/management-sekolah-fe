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
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type FormValues = {
  nama: string;
  namaGuru: string;
  nipGuru: string;
  ruangKelas: string;
  banner?: FileList; // file input
};

type Props = {
  openModal: string | null;
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
  dataEdit
}: Props) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  const isEdit = !!dataEdit;
  const queryClient = useQueryClient();

  // prefill data kalau edit
  useEffect(() => {
    if (dataEdit) {
      setValue('nama', dataEdit.nama);
      setValue('ruangKelas', dataEdit.ruangKelas);
    } else {
      reset();
    }
  }, [dataEdit, setValue, reset]);

  // === React Query Mutation ===
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!session?.user) throw new Error('Unauthorized');

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

      return method(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success(
        isEdit ? 'Kelas berhasil diperbarui' : 'Kelas berhasil ditambahkan'
      );
      queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] }); // kalau ada dashboard
      setOpenModal(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const { data: kelasList } = useQuery({
    queryKey: ['list-kelas-input'],
    queryFn: async () => {
      const res = await api.get('list-kelas-input');
      return res.data;
    }
  });

  const { data: ruangList } = useQuery({
    queryKey: ['ruang2'],
    queryFn: async () => {
      const res = await api.get('ruang2');
      return res.data.data;
    }
  });

  return (
    <Dialog
      open={openModal === 'kelas'}
      onOpenChange={() => setOpenModal(null)}
    >
      <DialogContent className='dark:text-white'>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{isEdit ? 'Edit Kelas' : 'Tambah Kelas'}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          {/* Select Kelas */}
          <div>
            <Select
              onValueChange={(val) => setValue('nama', val)}
              defaultValue={dataEdit?.nama || ''}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih Kelas' />
              </SelectTrigger>
              <SelectContent>
                {kelasList?.map((k: any) => (
                  <SelectItem key={k.id} value={k.namaKelas}>
                    {k.namaKelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nama && (
              <p className='text-sm text-red-500'>{errors.nama.message}</p>
            )}
          </div>

          {/* Select Ruangan */}
          <div>
            <Select
              onValueChange={(val) => setValue('ruangKelas', val)}
              defaultValue={dataEdit?.ruangKelas || ''}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih Ruangan' />
              </SelectTrigger>
              <SelectContent>
                {ruangList?.map((r: any) => (
                  <SelectItem key={r.id} value={r.nama}>
                    {r.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ruangKelas && (
              <p className='text-sm text-red-500'>
                {errors.ruangKelas.message}
              </p>
            )}
          </div>
          <div>
            <Input type='file' accept='image/*' {...register('banner')} />
            {isEdit && dataEdit?.bannerUrl && (
              <p className='mt-1 text-xs text-muted-foreground'>
                Banner saat ini sudah ada (akan diganti jika upload baru).
              </p>
            )}
          </div>
          <div className='flex justify-end'>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending
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
