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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import { CatatanPerkembanganSiswaType } from './walikelas-view';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { Pencil, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

interface Student2 {
  id: string;
  namaSiswa: string;
  nisSiswa: string;
}
type Props = {
  idKelas: string;
  siswa: Student2[];
  catatanList: CatatanPerkembanganSiswaType[];
};

interface FormValues {
  studentId: string;
  keterangan: string;
}

const CatatanPerkembanganSiswa = ({ siswa, idKelas, catatanList }: Props) => {
  const [editId, setEditId] = useState<string | null>(null);
  const { data: session } = useSession();
  const { toggleTrigger } = useRenderTrigger();

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      studentId: '',
      keterangan: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { idSiswa, nisSiswa, nama }: any = data.studentId; // udah langsung bisa ambil
      console.log('dasa', data);

      if (editId) {
        await api.put(
          `catatan-siswa/${editId}`,
          {
            idKelas: idKelas,
            idSiswa: data.studentId,
            content: data.keterangan
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setEditId(null);
      } else {
        await api.post(
          `catatan-siswa`,
          {
            idKelas: idKelas,
            idSiswa: data.studentId,
            content: data.keterangan
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
      }

      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }

    reset();
  };

  const handleEdit = (id: string) => {
    const catatan = catatanList.find((c) => c.id === id);
    if (!catatan) return;

    setValue('studentId', catatan.idSiswa); // pakai id aja
    setValue('keterangan', catatan.catatan);
    setEditId(id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`catatan-siswa/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      toggleTrigger();
      toast.success('Catatan berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus catatan');
    }
  };

  return (
    <Card className='mb-[200px]'>
      <CardHeader>
        <CardTitle>Catatan Perkembangan Siswa</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <Controller
            name='studentId'
            control={control}
            rules={{ required: 'Pilih siswa wajib diisi' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Pilih siswa' />
                </SelectTrigger>
                <SelectContent>
                  {siswa?.map((s: any) => (
                    <SelectItem key={s.id} value={s.idSiswa}>
                      {s.namaSiswa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name='keterangan'
            control={control}
            rules={{ required: 'Keterangan wajib diisi' }}
            render={({ field }) => (
              <Textarea
                placeholder='Tulis catatan perkembangan...'
                {...field}
              />
            )}
          />

          <Button type='submit'>
            {editId ? 'Update Catatan' : 'Tambah Catatan'}
          </Button>
        </form>

        {/* List */}
        {catatanList?.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            Belum ada catatan perkembangan.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
            {catatanList.map((c) => (
              <Card
                key={c.id}
                className='relative flex rounded-xl shadow-sm transition-shadow hover:shadow-md'
              >
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>
                    {c.nama}
                  </CardTitle>
                  <span className='text-xs text-gray-500'>{c.catatan}</span>
                </CardHeader>

                <CardFooter className='absolute -right-2 top-4 flex gap-2'>
                  <Button
                    size='icon'
                    variant='outline'
                    className='h-8 w-8 rounded-full'
                    onClick={() => handleEdit(c.id)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='destructive'
                    className='h-8 w-8 rounded-full'
                    onClick={() => handleDelete(c.id)}
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

export default CatatanPerkembanganSiswa;
