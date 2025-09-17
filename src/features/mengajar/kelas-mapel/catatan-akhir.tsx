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
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: { idSiswa: '', content: '' }
  });

  // Fetch catatan
  const fetchCatatan = async () => {
    try {
      const res = await api.get(`catatan-akhir-siswa/kelas/${idKelasMapel}`);
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
        // update
        await api.put(`/catatan-akhir-siswa/${editingId}`, {
          ...values,
          idKelasMapel
        });
        toast.success('Catatan berhasil diperbarui');
      } else {
        // create
        await api.post('/catatan-akhir-siswa', {
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

  // Filter by search term
  const filteredCatatan = catatanList.filter((c) =>
    (c.Siswa?.nama + ' ' + c.content)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      {/* List Catatan */}
      <div className='rounded-lg bg-white p-4 shadow'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Daftar Catatan Akhir Siswa</h3>
          <Input
            placeholder='Cari catatan...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-xs'
          />
        </div>
        {filteredCatatan.length === 0 ? (
          <p className='text-gray-500'>Belum ada catatan.</p>
        ) : (
          <ul className='space-y-2'>
            {filteredCatatan.map((c) => (
              <li
                key={c.id}
                className='flex items-center justify-between rounded-md border p-3'
              >
                <span>
                  <span className='font-semibold'>
                    {c.Siswa?.nama || 'Siswa'}
                  </span>
                  : {c.content}
                </span>
                <div className='flex gap-2'>
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

      {/* Form Tambah/Edit Catatan */}
      <div className='rounded-lg bg-white p-4 shadow'>
        <h3 className='mb-4 text-lg font-semibold'>
          {editingId ? 'Edit Catatan' : 'Tambah Catatan'}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Dropdown Siswa */}
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

            {/* Content */}
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
    </div>
  );
}
