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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';

export type ListKelas = {
  id: string;
  namaKelas: string;
};

export default function ListKelasForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: ListKelas | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const defaultValues = {
    namaKelas: initialData?.namaKelas || ''
  };

  const form = useForm({
    defaultValues
  });

  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}kelas/update/${id}`,
            values,
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
          toast.success('Kelas berhasil diubah');
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}list-kelas`,
            values,
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
          toast.success('Kelas berhasil dibuat');
        }
        router.push('/dashboard/master-data/list-kelas');
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormItem>
              <FormLabel>Nama Kelas</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Masukkan nama kelas...'
                  {...form.register('namaKelas', {
                    required: 'Nama kelas wajib diisi'
                  })}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.namaKelas?.message}
              </FormMessage>
            </FormItem>

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
