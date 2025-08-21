'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/lib/server';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type Buku = {
  nama: string;
  filepdf?: FileList;
  pengarang: string;
  penerbit: string;
  tahunTerbit: number;
  keterangan: string;
  stok: number;
};

export default function BukuForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Buku | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Buku>({
    defaultValues: {
      nama: initialData?.nama || '',
      pengarang: initialData?.pengarang || '',
      penerbit: initialData?.penerbit || '',
      tahunTerbit: initialData?.tahunTerbit || new Date().getFullYear(),
      keterangan: initialData?.keterangan || '',
      stok: initialData?.stok || 1
    }
  });

  async function onSubmit(values: Buku) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('nama', values.nama);
        formData.append('pengarang', values.pengarang);
        formData.append('penerbit', values.penerbit);
        formData.append('tahunTerbit', String(values.tahunTerbit));
        formData.append('keterangan', values.keterangan);
        formData.append('stok', String(values.stok));

        if (values.filepdf && values.filepdf[0]) {
          formData.append('filepdf', values.filepdf[0]); // upload PDF
        }

        if (id !== 'new') {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}buku/${id}`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );
          toast.success('Data buku berhasil diperbarui');
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}buku/`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );
          toast.success('Data buku berhasil disimpan');
        }

        router.push('/dashboard/e-perpus');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    });
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Nama Buku */}
              <FormItem>
                <FormLabel>Nama Buku</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan nama buku'
                    {...form.register('nama', { required: 'Nama wajib diisi' })}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.nama?.message}</FormMessage>
              </FormItem>

              {/* File PDF */}
              <FormItem>
                <FormLabel>File PDF</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='application/pdf'
                    {...form.register('filepdf')}
                  />
                </FormControl>
              </FormItem>

              {/* Pengarang */}
              <FormItem>
                <FormLabel>Pengarang</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nama pengarang'
                    {...form.register('pengarang', {
                      required: 'Pengarang wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.pengarang?.message}
                </FormMessage>
              </FormItem>

              {/* Penerbit */}
              <FormItem>
                <FormLabel>Penerbit</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nama penerbit'
                    {...form.register('penerbit', {
                      required: 'Penerbit wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.penerbit?.message}
                </FormMessage>
              </FormItem>

              {/* Tahun Terbit */}
              <FormItem>
                <FormLabel>Tahun Terbit</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...form.register('tahunTerbit', {
                      required: 'Tahun terbit wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.tahunTerbit?.message}
                </FormMessage>
              </FormItem>

              {/* Stok */}
              <FormItem>
                <FormLabel>Stok</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...form.register('stok', {
                      required: 'Stok wajib diisi',
                      valueAsNumber: true
                    })}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.stok?.message}</FormMessage>
              </FormItem>

              {/* Keterangan */}
              <FormItem className='md:col-span-2'>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Masukkan keterangan buku...'
                    {...form.register('keterangan')}
                  />
                </FormControl>
              </FormItem>
            </div>

            <Button type='submit' disabled={loading}>
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                'Simpan'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
