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
import axios from 'axios';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { PengumumanKelasType } from './walikelas-view';
import { Pencil, Trash2 } from 'lucide-react';

interface Pengumuman {
  id: number;
  title: string;
  time: string;
  content: string;
}

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
  const [loading, setLoading] = useState(false);
  const { trigger, toggleTrigger } = useRenderTrigger();

  const { register, handleSubmit, reset, control, setValue } =
    useForm<FormValues>({
      defaultValues: {
        judul: '',
        konten: ''
      }
    });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (editId) {
        // Edit
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}pengumuman-kelas/${editId}`,
          {
            idKelas: id,
            title: data.judul,
            content: data.konten
          }
        );

        setEditId(null);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}pengumuman-kelas`, {
          idKelas: id,
          title: data.judul,
          content: data.konten
        });
      }

      toast.success('Berhasil membuat atau mengubah pengumuman');
    } catch (error) {
      toast.error('Gagal membuat atau mengubah pengumuman');
    } finally {
      reset();
      setValue('konten', '');
      setLoading(false);
      toggleTrigger();
    }
  };

  const handleEdit = (id: string) => {
    const item = pengumuman.find((p) => p.id === id);
    if (!item) return;
    setValue('judul', item.title);
    setValue('konten', item.content);
    setEditId(id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}pengumuman-kelas/${id}`
      );
      toast.success('Berhasil menghapus pengumuman');
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal menghapus pengumuman');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengumuman Kelas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
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
          <Button type='submit' className='mt-10' disabled={loading}>
            {loading
              ? editId
                ? 'Menyimpan Perubahan...'
                : 'Menambahkan...'
              : editId
                ? 'Update Pengumuman'
                : 'Tambah Pengumuman'}
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
                className='relative flex rounded-xl shadow-sm transition-shadow hover:shadow-md'
              >
                <CardHeader className=''>
                  <CardTitle className='text-base font-semibold'>
                    {p.title}
                  </CardTitle>
                  <span className='text-xs text-gray-500'>
                    {format(new Date(p.time), 'dd MMMM yyyy')}
                  </span>
                </CardHeader>

                <CardFooter className='absolute -right-2 top-4 flex justify-end gap-2'>
                  <Button
                    size='icon'
                    variant='outline'
                    className='h-8 w-8 rounded-full'
                    onClick={() => handleEdit(p.id)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>

                  <Button
                    size='icon'
                    variant='destructive'
                    className='h-8 w-8 rounded-full'
                    onClick={() => handleDelete(p.id)}
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
