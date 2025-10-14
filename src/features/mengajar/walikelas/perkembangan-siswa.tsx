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
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Props {
  idKelas: string;
  siswa: any[];
  catatanList: any[];
}

interface FormValues {
  studentId: string;
  keterangan: string;
  kategori: string;
}

const CatatanPerkembanganSiswa = ({ siswa, idKelas, catatanList }: Props) => {
  const [editId, setEditId] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.user?.token || '';
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors } // <== ambil error state
  } = useForm<FormValues>({
    defaultValues: { studentId: '', keterangan: '', kategori: '' }
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (payload: {
      idSiswa: string;
      content: string;
      kategori: string;
    }) => {
      const res = await api.post(
        `catatan-siswa`,
        { idKelas, ...payload },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWaliKelas'] });
      toast.success('Catatan berhasil ditambahkan');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal menambah catatan')
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async (vars: {
      id: string;
      idSiswa: string;
      content: string;
      kategori: string;
    }) => {
      const res = await api.put(
        `catatan-siswa/${vars.id}`,
        {
          idKelas,
          idSiswa: vars.idSiswa,
          content: vars.content,
          kategori: vars.kategori
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWaliKelas'] });
      toast.success('Catatan berhasil diperbarui');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal update catatan')
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`catatan-siswa/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWaliKelas'] });
      toast.success('Catatan berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus catatan')
  });

  const onSubmit = (data: FormValues) => {
    if (editId) {
      updateMutation.mutate({
        id: editId,
        idSiswa: data.studentId,
        content: data.keterangan,
        kategori: data.kategori
      });
      setEditId(null);
    } else {
      createMutation.mutate({
        idSiswa: data.studentId,
        content: data.keterangan,
        kategori: data.kategori
      });
    }
    reset();
  };

  const handleEdit = (id: string) => {
    const catatan = catatanList.find((c: any) => c.id === id);
    if (!catatan) return;
    setValue('studentId', catatan.idSiswa);
    setValue('keterangan', catatan.catatan);
    setValue('kategori', catatan.kategori);
    setEditId(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Catatan Perkembangan Siswa</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          {/* === PILIH SISWA === */}
          <div>
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
                    {siswa?.map((s) => (
                      <SelectItem key={s.id} value={s.Siswa.id}>
                        {s.namaSiswa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.studentId && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.studentId.message}
              </p>
            )}
          </div>

          {/* === KATEGORI === */}
          <div>
            <Controller
              name='kategori'
              control={control}
              rules={{ required: 'Kategori wajib dipilih' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Pilih kategori' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Academic'>Academic</SelectItem>
                    <SelectItem value='Social Emotional'>
                      Social Emotional
                    </SelectItem>
                    <SelectItem value='Extracurricular'>
                      Extracurricular
                    </SelectItem>
                    <SelectItem value='Behavior'>Behavior</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.kategori && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.kategori.message}
              </p>
            )}
          </div>

          {/* === KETERANGAN === */}
          <div>
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
            {errors.keterangan && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.keterangan.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editId ? 'Update Catatan' : 'Tambah Catatan'}
          </Button>
        </form>

        {/* === LIST CATATAN === */}
        {catatanList.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            Belum ada catatan perkembangan.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
            {catatanList.map((c: any) => (
              <Card key={c.id} className='relative rounded-xl shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>
                    {c.nama}
                  </CardTitle>
                  <span className='text-xs text-gray-500'>{c.kategori}</span>
                  <p className='text-sm'>{c.catatan}</p>
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
                    onClick={() => deleteMutation.mutate(c.id)}
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
