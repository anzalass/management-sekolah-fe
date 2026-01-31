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
import { Pencil, Trash2, Search, X } from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
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
  const [searchTerm, setSearchTerm] = useState('');

  /** IMAGE STATE */
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, control, setValue } =
    useForm<FormValues>({
      defaultValues: { idKelas: '', judul: '', konten: '' }
    });

  /* ===================== FETCH ===================== */

  const { data: kelasData } = useQuery({
    queryKey: ['kelasDropdown'],
    queryFn: async () => {
      const res = await api.get('pengumuman-data-kelas', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.result;
    },
    enabled: !!session?.user?.token
  });

  const { data: pengumuman = [] } = useQuery({
    queryKey: ['pengumuman-guru'],
    queryFn: async () => {
      const res = await api.get('pengumuman-kelas-guru', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res?.data ?? [];
    },
    enabled: !!session?.user?.token
  });

  /* ===================== MUTATION ===================== */

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('pengumuman-kelas', formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-guru'] });
      toast.success('Pengumuman berhasil ditambahkan');
    },
    onError: () => toast.error('Gagal menambah pengumuman')
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      formData
    }: {
      id: string;
      formData: FormData;
    }) => {
      const res = await api.put(`pengumuman-kelas/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-guru'] });
      toast.success('Pengumuman berhasil diperbarui');
    },
    onError: () => toast.error('Gagal update pengumuman')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`pengumuman-kelas/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-guru'] });
      toast.success('Pengumuman berhasil dihapus');
    }
  });

  /* ===================== HANDLER ===================== */

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;

    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  const onSubmit = (data: FormValues) => {
    if (!data.idKelas) {
      toast.error('Pilih kelas dulu');
      return;
    }

    const formData = new FormData();
    formData.append('idKelas', data.idKelas);
    formData.append('title', data.judul);
    formData.append('content', data.konten);

    if (file) formData.append('image', file);

    if (editId) {
      updateMutation.mutate({ id: editId, formData });
      setEditId(null);
    } else {
      createMutation.mutate(formData);
    }

    reset();
    setFile(null);
    setPreview(null);
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setValue('idKelas', item.idKelas);
    setValue('judul', item.title);
    setValue('konten', item.content);

    // 🔥 PREVIEW FOTO LAMA
    setPreview(item.fotoUrl || null);
    setFile(null);
  };

  const filteredPengumuman = pengumuman.filter((p: any) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ===================== RENDER ===================== */

  return (
    <Card>
      <CardHeader className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <CardTitle>Pengumuman Kelas</CardTitle>

        <div className='relative w-full md:w-1/3'>
          <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari judul...'
            className='pl-9'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className='space-y-8'>
        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* IMAGE */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Header Image</label>

            {preview ? (
              <div className='relative'>
                <Image
                  src={preview}
                  alt='Preview'
                  width={1200}
                  height={400}
                  className='h-[220px] w-full rounded-lg object-cover'
                />
                <Button
                  type='button'
                  size='icon'
                  variant='destructive'
                  className='absolute right-3 top-3'
                  onClick={removeImage}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <label className='flex h-[220px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground hover:bg-muted'>
                Klik untuk upload foto
                <Input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleSelectImage}
                />
              </label>
            )}
          </div>

          {/* KELAS */}
          <Controller
            name='idKelas'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih Kelas' />
                </SelectTrigger>
                <SelectContent>
                  {kelasData?.map((k: any) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.nama}
                    </SelectItem>
                  ))}
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

          <Button type='submit'>
            {editId ? 'Update Pengumuman' : 'Tambah Pengumuman'}
          </Button>
        </form>

        {/* TABLE */}
        <div className='overflow-x-auto rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPengumuman.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>
                    {format(new Date(p.time), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className='flex gap-2'>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={() => handleEdit(p)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size='icon'
                      variant='destructive'
                      onClick={() => deleteMutation.mutate(p.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PengumumanKelasGuru;
