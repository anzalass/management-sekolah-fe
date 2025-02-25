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

import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/constants/mock-api';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';

// Tipe Data Siswa
export type Ruangan = {
  nama: string;
  keterangan: string;
};

export default function RuanganForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Ruangan | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  // Default Values dengan Fallback
  const defaultValue = {
    nama: initialData?.nama,
    keterangan: initialData?.keterangan
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
            `${API}ruang/update/${id}`,
            { ...values },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data ruangan berhasil diubah');
        } else {
          await axios.post(
            `${API}ruang/create`,
            {
              ...values
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data ruangan berhasil disimpan');
        }

        router.push('/dashboard/master-data/ruangan');
      } catch (error) {
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
                  <FormLabel>Nama Ruangan</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Nama Ruangan...'
                      {...form.register('nama', {
                        required: 'Nama Ruangan wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nama?.message}
                  </FormMessage>
                </FormItem>

                {/* Keterangan */}
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Keterangan...'
                      {...form.register('keterangan')}
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
