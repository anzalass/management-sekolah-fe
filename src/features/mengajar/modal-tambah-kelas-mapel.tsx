'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type FormValues = {
  namaMapel: string;
  kelas: string;
  ruangKelas: string;
  namaGuru: string;
  nipGuru: string;
  fotoBanner: FileList;
};

type Props = {
  openModal: string | null;
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
  dataEdit
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>();

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isEdit = !!dataEdit;
  const watchFile = watch('fotoBanner');

  // ==============================
  // GET data dari API pakai useQuery
  // ==============================
  const { data: mapelList } = useQuery({
    queryKey: ['mapel-input'],
    queryFn: async () => {
      const res = await api.get('mapel-input');
      return res.data.result;
    }
  });

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

  // Prefill kalau edit
  useEffect(() => {
    if (dataEdit) {
      setValue('namaMapel', dataEdit.namaMapel);
      setValue('kelas', dataEdit.kelas);
      setValue('ruangKelas', dataEdit.ruangKelas);
    } else {
      reset();
    }
  }, [dataEdit, setValue, reset]);

  // ==============================
  // MUTATION: Tambah/Edit data
  // ==============================
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!session?.user) throw new Error('Unauthorized');

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

      return method(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success(
        isEdit ? 'Berhasil memperbarui data' : 'Berhasil menambah data'
      );
      queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] });
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
          {/* Select Mapel */}
          <div>
            <Select
              onValueChange={(val) => setValue('namaMapel', val)}
              defaultValue={dataEdit?.namaMapel || ''}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih Mata Pelajaran' />
              </SelectTrigger>
              <SelectContent>
                {mapelList?.map((m: any) => (
                  <SelectItem key={m.id} value={m.nama}>
                    {m.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.namaMapel && (
              <p className='text-sm text-red-500'>{errors.namaMapel.message}</p>
            )}
          </div>

          {/* Select Kelas */}
          <div>
            <Select
              onValueChange={(val) => setValue('kelas', val)}
              defaultValue={dataEdit?.kelas || ''}
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
            {errors.kelas && (
              <p className='text-sm text-red-500'>{errors.kelas.message}</p>
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

          {/* Upload Banner */}
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

          {/* Submit Button */}
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
