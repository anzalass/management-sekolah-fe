'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { format } from 'date-fns';
import RichTextEditor from '@/features/texteditor/textEditor';
import { toast } from 'sonner';
import { Pencil, Trash2, Search } from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table';

interface FormValues {
  idKelas: string;
  judul: string;
  konten: string;
}

const PengumumanKelasGuru = () => {
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 Tambahan untuk search
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, control, setValue } =
    useForm<FormValues>({
      defaultValues: { idKelas: '', judul: '', konten: '' }
    });

  // Fetch kelas
  const { data: kelasData, isLoading: kelasLoading } = useQuery({
    queryKey: ['kelasDropdown'],
    queryFn: async () => {
      const res = await api.get('pengumuman-data-kelas', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.result;
    },
    enabled: !!session?.user?.token
  });

  // Fetch pengumuman
  const { data: pengumuman = [], isLoading: pengumumanLoading } = useQuery({
    queryKey: ['pengumuman-guru'],
    queryFn: async () => {
      const res = await api.get('pengumuman-kelas-guru', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res?.data ?? [];
    },
    enabled: !!session?.user?.token
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (payload: {
      idKelas: string;
      title: string;
      content: string;
    }) => {
      const res = await api.post(`pengumuman-kelas`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-guru'] });
      toast.success('Pengumuman berhasil ditambahkan');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal menambah pengumuman')
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async (vars: {
      id: string;
      idKelas: string;
      title: string;
      content: string;
    }) => {
      const res = await api.put(`pengumuman-kelas/${vars.id}`, vars, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-guru'] });
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
      queryClient.invalidateQueries({ queryKey: ['pengumuman-guru'] });
      toast.success('Pengumuman berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus pengumuman')
  });

  // Submit
  const onSubmit = (data: FormValues) => {
    if (!data.idKelas) {
      toast.error('Pilih kelas terlebih dahulu!');
      return;
    }

    if (editId) {
      updateMutation.mutate({
        id: editId,
        idKelas: data.idKelas,
        title: data.judul,
        content: data.konten
      });
      setEditId(null);
    } else {
      createMutation.mutate({
        idKelas: data.idKelas,
        title: data.judul,
        content: data.konten
      });
    }
    reset();
    setValue('konten', '');
  };

  const handleEdit = (id: string) => {
    const item = pengumuman.find((p: any) => p.id === id);
    if (!item) return;
    setValue('judul', item.title);
    setValue('konten', item.content);
    setEditId(id);
  };

  // 🔍 Filter hasil berdasarkan search
  const filteredPengumuman = pengumuman.filter((p: any) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className='p-0'>
      <CardHeader className='flex flex-col items-start justify-between gap-3 p-3 md:flex-row md:items-center md:p-5'>
        <CardTitle className='text-sm md:text-base lg:text-lg'>
          Pengumuman Kelas
        </CardTitle>

        {/* 🔍 Input Search */}
        <div className='relative w-full md:w-1/3'>
          <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
          <Input
            type='text'
            placeholder='Cari judul pengumuman...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-9'
          />
        </div>
      </CardHeader>

      <CardContent className='space-y-8 p-3'>
        {/* Form tambah/update */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <Controller
            name='idKelas'
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val) => field.onChange(val)}
                value={field.value}
                disabled={kelasLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih Kelas' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key='all' value='All'>
                    Semua
                  </SelectItem>
                  {kelasData?.length > 0 ? (
                    kelasData.map((k: any) => (
                      <SelectItem key={k.id} value={k.id}>
                        {k.nama}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='no-class' disabled>
                      Tidak ada kelas
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />

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

        {/* List Pengumuman */}
        {filteredPengumuman.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            {searchTerm
              ? 'Tidak ada hasil pencarian.'
              : 'Belum ada pengumuman.'}
          </p>
        ) : (
          <div className='w-full overflow-auto rounded-lg border shadow-sm'>
            <Table className='w-[150vw] md:w-full'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[40%]'>Judul</TableHead>
                  <TableHead className='w-[20%]'>Tanggal</TableHead>
                  <TableHead className='w-[30%]'>Konten</TableHead>
                  <TableHead className='w-[10%] text-center'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPengumuman.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className='font-medium'>{p.title}</TableCell>
                    <TableCell>
                      {format(new Date(p.time), 'dd MMMM yyyy')}
                    </TableCell>
                    <TableCell className='max-w-xs text-gray-600'>
                      <div
                        className='overflow-hidden truncate text-ellipsis whitespace-nowrap'
                        dangerouslySetInnerHTML={{ __html: p?.content }}
                      ></div>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex items-center justify-center gap-2'>
                        <Button
                          size='icon'
                          variant='outline'
                          className='rounded-lg'
                          onClick={() => handleEdit(p.id)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          size='icon'
                          variant='destructive'
                          className='rounded-lg'
                          onClick={() => deleteMutation.mutate(p.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PengumumanKelasGuru;
