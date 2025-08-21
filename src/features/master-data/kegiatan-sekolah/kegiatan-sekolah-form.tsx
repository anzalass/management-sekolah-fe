'use client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';

// Tipe Data Siswa
export type KegiatanSekolah = {
  nama: string;
  tahunAjaran: string;
  keterangan: string;
  waktuMulai: Date;
  waktuSelesai: Date;
  status: string;
};

export default function KegiatanSekolahForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: KegiatanSekolah | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  // Default Values dengan Fallback
  const defaultValue = {
    nama: initialData?.nama,
    tahunAjaran: initialData?.tahunAjaran,
    keterangan: initialData?.keterangan,
    waktuMulai: initialData?.waktuMulai
      ? new Date(initialData.waktuSelesai).toISOString().split('T')[0]
      : '',
    waktuSelesai: initialData?.waktuSelesai
      ? new Date(initialData.waktuSelesai).toISOString().split('T')[0]
      : '',
    status: initialData?.status
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  // Handle Submit
  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}kegiatan-sekolah/update/${id}`,
            { ...values },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data kegiatan sekolah berhasil diubah');
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}kegiatan-sekolah/create`,
            {
              ...values
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data kegiatan sekolah berhasil disimpan');
        }

        router.push('/dashboard/master-data/kegiatan-sekolah');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Terjadi Kesalahan');
      }
    });
  }

  // Handle File Upload
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
            <div className='space-y-6'>
              {/* Foto */}

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* NIS */}
                <FormItem>
                  <FormLabel>Nama Kegiatan</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Nama Kegiatan...'
                      {...form.register('nama', {
                        required: 'Nama Kegiatan wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nama?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Tahun Ajaran</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Tahun Ajaran...'
                      {...form.register('tahunAjaran', {
                        required: 'Tahun Ajaran wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nama?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Waktu Mulai</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...form.register('waktuMulai', {
                        required: 'Waktu Mulai wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.waktuMulai?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Waktu Selesai</FormLabel>
                  <FormControl>
                    <Input type='date' {...form.register('waktuSelesai')} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.waktuSelesai?.message}
                  </FormMessage>
                </FormItem>

                {/* Keterangan */}
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Keterangan...'
                      {...form.register('keterangan', {
                        required: 'Alamat wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.keterangan?.message}
                  </FormMessage>
                </FormItem>
              </div>
            </div>
            {/* Tombol Submit */}
            <Button type='submit' disabled={loading}>
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                'Simpan'
              )}
            </Button>{' '}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
