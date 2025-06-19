'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '@/lib/server';
export type KelasdanMapel = {
  id: string;
  namaMapel: string;
  ruangKelas: Date;
  waktuMengajar: number;
  kelas: string;
  tahunAjaran: string;
};
export default function MengajarForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: KelasdanMapel | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      namaMapel: initialData?.namaMapel || '',
      ruangKelas: initialData?.ruangKelas
        ? new Date(initialData.ruangKelas).toISOString().substring(0, 10)
        : '',
      waktuMengajar: initialData?.waktuMengajar || '',
      kelas: initialData?.kelas || '',
      tahunAjaran: initialData?.tahunAjaran || ''
    }
  });

  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await axios.put(`${API}mengajar/update/${id}`, values);
          toast.success('Data mengajar berhasil diperbarui');
        } else {
          await axios.post(`${API}mengajar/create`, values);
          toast.success('Data mengajar berhasil ditambahkan');
        }

        router.push('/dashboard/master-data/mengajar');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
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
              <FormItem>
                <FormLabel>Nama Mapel</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Contoh: Bahasa Indonesia'
                    {...form.register('namaMapel', {
                      required: 'Nama mapel wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.namaMapel?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Hari / Tanggal</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    {...form.register('ruangKelas', {
                      required: 'Tanggal mengajar wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.ruangKelas?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Jam Mengajar (24 jam)</FormLabel>
                <FormControl>
                  <Input
                    type='time'
                    {...form.register('waktuMengajar', {
                      required: 'Jam mengajar wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.waktuMengajar?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Kelas</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Contoh: XII MIPA 1'
                    {...form.register('kelas', {
                      required: 'Kelas wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.kelas?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Tahun Ajaran</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Contoh: 2024/2025'
                    {...form.register('tahunAjaran', {
                      required: 'Tahun ajaran wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.tahunAjaran?.message}
                </FormMessage>
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
