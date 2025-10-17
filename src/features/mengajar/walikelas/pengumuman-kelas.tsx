'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import RichTextEditor from '@/features/texteditor/textEditor';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PengumumanKelasType } from './walikelas-view';

interface FormValues {
  judul: string;
  konten: string;
}

type IDKelas = {
  id: string;
  pengumuman: PengumumanKelasType[];
};

const PengumumanKelas = ({ id, pengumuman }: IDKelas) => {
  const [editId, setEditId] = useState<string | null>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, control, setValue } =
    useForm<FormValues>({
      defaultValues: { judul: '', konten: '' }
    });

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      const res = await api.post(
        `pengumuman-kelas`,
        { idKelas: id, ...payload },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWaliKelas', id] });
      toast.success('Pengumuman berhasil ditambahkan');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal menambah pengumuman')
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async (vars: {
      id: string;
      title: string;
      content: string;
    }) => {
      const res = await api.put(
        `pengumuman-kelas/${vars.id}`,
        { idKelas: id, title: vars.title, content: vars.content },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWaliKelas', id] });
      toast.success('Pengumuman berhasil diperbarui');
    },
    onError: () => toast.error('Gagal update pengumuman')
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (idPengumuman: string) => {
      const res = await api.delete(`pengumuman-kelas/${idPengumuman}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWaliKelas', id] });
      toast.success('Pengumuman berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus pengumuman')
  });

  const onSubmit = (data: FormValues) => {
    if (editId) {
      updateMutation.mutate({
        id: editId,
        title: data.judul,
        content: data.konten
      });
      setEditId(null);
    } else {
      createMutation.mutate({ title: data.judul, content: data.konten });
    }
    reset();
    setValue('konten', '');
  };

  const handleEdit = (id: string) => {
    const item = pengumuman.find((p) => p.id === id);
    if (!item) return;
    setValue('judul', item.title);
    setValue('konten', item.content);
    setEditId(id);
  };

  return (
    <Card className='p-0'>
      <CardHeader className='p-3 md:p-5'>
        <CardTitle className='text-base'>Pengumuman Kelas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-8 p-3'>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Input
            placeholder='Judul Pengumuman'
            {...register('judul', { required: true })}
          />
          <Controller
            name='konten'
            control={control}
            render={({ field }) => (
              <RichTextEditor content={field.value} onChange={field.onChange} />
            )}
          />
          <Button type='submit' className='mt-10'>
            {editId ? 'Update Pengumuman' : 'Tambah Pengumuman'}
          </Button>
        </form>

        {/* List */}
        {pengumuman.length === 0 ? (
          <p className='text-sm text-muted-foreground'>Belum ada pengumuman.</p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {pengumuman.map((p) => (
              <Card
                key={p.id}
                className='flex flex-col justify-between rounded-xl shadow-sm transition-shadow hover:shadow-md'
              >
                <CardHeader className='p-3 md:p-5'>
                  <CardTitle className='text-base font-semibold'>
                    {p.title}
                  </CardTitle>
                  <span className='text-xs text-gray-500'>
                    {format(new Date(p.time), 'dd MMMM yyyy')}
                  </span>
                </CardHeader>

                <CardFooter className='mt-auto flex gap-2 p-4'>
                  <Button
                    size='icon'
                    variant='outline'
                    className='w-full rounded-lg'
                    onClick={() => handleEdit(p.id)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='destructive'
                    className='w-full rounded-lg'
                    onClick={() => deleteMutation.mutate(p.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PengumumanKelas;
