'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Pencil, Trash2, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const { data: session } = useSession();
  const token = session?.user?.token || '';
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: { studentId: '', keterangan: '', kategori: '' }
  });

  // Mutations (sama seperti sebelumnya)
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

  // === FILTERING DI FRONTEND ===
  const filteredCatatan = useMemo(() => {
    return catatanList.filter((catatan) => {
      const cocokNama = catatan.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const cocokKategori =
        filterKategori === 'Semua' || catatan.kategori === filterKategori;
      return cocokNama && cocokKategori;
    });
  }, [catatanList, searchTerm, filterKategori]);

  // Ambil daftar kategori unik untuk filter
  const kategoriOptions = useMemo(() => {
    const kats = new Set(catatanList.map((c: any) => c.kategori));
    return ['Semua', ...Array.from(kats)];
  }, [catatanList]);

  return (
    <Card>
      <CardHeader className='p-3 md:p-6'>
        <CardTitle className='text-base'>Catatan Perkembangan Siswa</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-3 md:p-6'>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {/* Siswa */}
            <div>
              <Controller
                name='studentId'
                control={control}
                rules={{ required: 'Pilih siswa wajib diisi' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih siswa' />
                    </SelectTrigger>
                    <SelectContent>
                      {siswa?.map((s) => (
                        <SelectItem key={s.Siswa.id} value={s.Siswa.id}>
                          {s.Siswa.nama}
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

            {/* Kategori */}
            <div>
              <Controller
                name='kategori'
                control={control}
                rules={{ required: 'Kategori wajib dipilih' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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

            {/* Aksi */}
            <div className='flex items-end'>
              <Button
                type='submit'
                className='w-full'
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editId ? 'Update' : 'Tambah'}
              </Button>
            </div>
          </div>

          {/* Keterangan */}
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
        </form>

        {/* Filter */}
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='relative w-full md:w-1/3'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Cari nama siswa...'
              className='pl-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterKategori} onValueChange={setFilterKategori}>
            <SelectTrigger className='w-full md:w-auto'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {kategoriOptions.map((kat) => (
                <SelectItem key={kat} value={kat}>
                  {kat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabel */}
        <div className='overflow-x-auto rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className='text-right'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCatatan.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='py-6 text-center text-muted-foreground'
                  >
                    Tidak ada catatan ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCatatan.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className='font-medium'>{c.nama}</TableCell>
                    <TableCell>
                      <span className='inline-block rounded-full bg-muted px-2 py-1 text-xs'>
                        {c.kategori}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className='line-clamp-2 max-w-[300px] text-sm text-muted-foreground'>
                        {c.catatan}
                      </p>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => handleEdit(c.id)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          size='icon'
                          variant='destructive'
                          onClick={() => deleteMutation.mutate(c.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatatanPerkembanganSiswa;
