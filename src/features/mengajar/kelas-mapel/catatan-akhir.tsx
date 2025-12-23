'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Search } from 'lucide-react';

interface Siswa {
  id: string;
  nama: string;
  nis?: string;
}

interface Catatan {
  id: string;
  idSiswa: string;
  content: string;
  Siswa: Siswa;
}

interface CatatanAkhirSiswaProps {
  idKelasMapel: string;
  listSiswa: any[];
}

interface FormValues {
  idSiswa: string;
  content: string;
}

export default function CatatanAkhirSiswa({
  idKelasMapel,
  listSiswa
}: CatatanAkhirSiswaProps) {
  const [catatanList, setCatatanList] = useState<Catatan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNamaSiswa, setFilterNamaSiswa] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    defaultValues: { idSiswa: '', content: '' }
  });

  // Fetch catatan
  const fetchCatatan = async () => {
    try {
      const res = await api.get(`catatan-akhir-siswa/kelas/${idKelasMapel}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setCatatanList(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil data catatan');
    }
  };

  useEffect(() => {
    fetchCatatan();
  }, [idKelasMapel]);

  // Submit form
  const onSubmit = async (values: FormValues) => {
    try {
      if (editingId) {
        await api.put(`catatan-akhir-siswa/${editingId}`, {
          ...values,
          idKelasMapel
        });
        toast.success('Catatan berhasil diperbarui');
      } else {
        await api.post('catatan-akhir-siswa', {
          ...values,
          idKelasMapel
        });
        toast.success('Catatan berhasil ditambahkan');
      }
      form.reset();
      setEditingId(null);
      fetchCatatan();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Gagal menyimpan catatan');
    }
  };

  // Edit handler
  const handleEdit = (catatan: Catatan) => {
    setEditingId(catatan.id);
    form.reset({
      idSiswa: catatan.idSiswa,
      content: catatan.content
    });
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return;
    try {
      await api.delete(`/catatan-akhir-siswa/${id}`);
      toast.success('Catatan berhasil dihapus');
      fetchCatatan();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus catatan');
    }
  };

  // Filter hanya berdasarkan nama siswa
  const filteredCatatan = catatanList.filter((c) =>
    (c.Siswa?.nama || '').toLowerCase().includes(filterNamaSiswa.toLowerCase())
  );

  return (
    <Card className='space-y-6 p-3 pt-5 md:p-5'>
      {/* === FILTER NAMA SISWA === */}
      <div>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-base font-semibold'>
            Daftar Catatan Akhir Siswa
          </h3>
        </div>
        <div className='relative max-w-xs'>
          <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari nama siswa...'
            className='pl-10'
            value={filterNamaSiswa}
            onChange={(e) => setFilterNamaSiswa(e.target.value)}
          />
        </div>
      </div>

      {/* === LIST CATATAN === */}
      <div>
        {filteredCatatan.length === 0 ? (
          <p className='text-gray-500'>Belum ada catatan.</p>
        ) : (
          <ul className='space-y-2'>
            {filteredCatatan.map((c) => (
              <li
                key={c.id}
                className='flex items-start justify-between rounded-md border p-3'
              >
                <div>
                  <span className='font-semibold'>
                    {c.Siswa?.nama || 'Siswa'}
                  </span>
                  <span className='ml-2 text-sm text-muted-foreground'>
                    {c.Siswa?.nis && `(${c.Siswa.nis})`}
                  </span>
                  <p className='mt-1 text-sm'>{c.content}</p>
                </div>
                <div className='ml-4 flex flex-col gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* === FORM TAMBAH/EDIT === */}
      <div className='p-0'>
        <h3 className='mb-4 text-base font-semibold'>
          {editingId ? 'Edit Catatan' : 'Tambah Catatan'}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='idSiswa'
              rules={{ required: 'Pilih siswa' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Siswa</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih siswa' />
                      </SelectTrigger>
                      <SelectContent>
                        {listSiswa.map((s) => (
                          <SelectItem key={s.Siswa.id} value={s.Siswa.id}>
                            {s.Siswa.nis} - {s.Siswa.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              rules={{ required: 'Isi catatan tidak boleh kosong' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      rows={3}
                      placeholder='Tulis catatan...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2'>
              <Button type='submit'>
                {editingId ? 'Simpan Perubahan' : 'Tambah Catatan'}
              </Button>
              {editingId && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setEditingId(null);
                    form.reset();
                  }}
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}
