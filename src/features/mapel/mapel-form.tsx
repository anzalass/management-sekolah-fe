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
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';

// Tipe Data Siswa
export type Mapel = {
  nama: string;
  kelas: string;
};

export default function MapelForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Mapel | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  // Default Values dengan Fallback
  const defaultValue = {
    nama: initialData?.nama,
    kelas: initialData?.kelas
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
            `${API}mapel/update/${id}`,
            { ...values },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data Mapel berhasil diubah');
        } else {
          await axios.post(
            `${API}mapel/create`,
            {
              ...values
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data Mapel berhasil disimpan');
        }

        router.push('/dashboard/master-data/mata-pelajaran');
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
                  <FormLabel>Nama Mata Pelajaran</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Nama Mata Pelajaran...'
                      {...form.register('nama', {
                        required: 'Nama Mata Pelajaran wajib diisi',
                        minLength: { value: 6, message: 'Minimal 6 karakter' }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nama?.message}
                  </FormMessage>
                </FormItem>

                {/* Keterangan */}
                <FormItem>
                  <FormLabel>Kelas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Kelas...'
                      {...form.register('kelas', {
                        required: 'Kelas wajib diisi',
                        minLength: {
                          value: 3,
                          message: 'Masukkan Kelas Minimal 3 Karakter'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.kelas?.message}
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
