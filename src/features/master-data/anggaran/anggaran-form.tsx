'use client';
import type { AxiosError } from 'axios'; // pastikan di atas sudah ada
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

// Tipe Data Siswa
export type Anggaran = {
  id: string;
  nama: string;
  tanggal: Date;
  jumlah: number;
  jenis: string;
  keterangan: string;
};

export default function AnggaranForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Anggaran | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const defaultValue = {
    nama: initialData?.nama,
    tanggal: initialData?.tanggal
      ? new Date(initialData.tanggal).toISOString().split('T')[0] // Konversi ke Date dulu
      : '',
    jumlah: initialData?.jumlah,
    jenis: initialData?.jenis,
    keterangan: initialData?.keterangan
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  const { data: session } = useSession();

  // Handle Submit
  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await api.put(
            `anggaran/update/${id}`,
            { ...values },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
          toast.success('Data anggaran berhasil diubah');
        } else {
          await api.post(
            `anggaran/create`,
            {
              ...values
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
          toast.success('Data anggaran berhasil disimpan');
        }

        router.push('/dashboard/master-data/anggaran');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    });
  }

  // Handle File Upload
  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-xl font-bold md:text-2xl'>
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
                  <FormLabel>Nama Anggaran</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Nama Anggaran...'
                      {...form.register('nama', {
                        required: 'Nama Anggaran wajib diisi',
                        minLength: {
                          value: 6,
                          message: 'Minimal 6 Karakter'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nama?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Tanggal Anggaran</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      placeholder='Masukkan Tanggal Anggaran...'
                      {...form.register('tanggal', {
                        required: 'Tanggal Anggaran wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.tanggal?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Jumlah Anggaran</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan Jumlah Anggaran...'
                      {...form.register('jumlah', {
                        required: 'Jumlah Anggaran wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.jumlah?.message}
                  </FormMessage>
                </FormItem>

                <FormField
                  control={form.control}
                  name='jenis'
                  rules={{ required: 'Jenis Anggaran wajib dipilih' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Jenis Anggaran</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih Jenis Anggaran' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='pemasukan'>Pemasukan</SelectItem>
                          <SelectItem value='pengeluaran'>
                            Pengeluaran
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.jenis?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

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
