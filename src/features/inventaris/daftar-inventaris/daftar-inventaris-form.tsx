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
import { useEffect, useState, useTransition } from 'react';
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
import { JenisInventaris } from '../jenis-inventaris/jenis-inventaris-form';
import { Ruangan } from '@/features/master-data/ruang/ruang-listing';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export type Inventaris = {
  id: string;
  nama: string;
  quantity: number;
  ruang: string;
  hargaBeli: number;
  waktuPengadaan: Date;
  keterangan: string;
};

export default function DaftarInventarisForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Inventaris | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [JenisInventaris, setJenisInventaris] = useState<JenisInventaris[]>([]);
  const [ruang, setRuang] = useState<Ruangan[]>([]);

  const getAllJenisInventaris = async () => {
    try {
      const response = await api.get(`jenis-inventaris2`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setJenisInventaris(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const getAllRuang = async () => {
    try {
      const response = await api.get(`ruang2`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setRuang(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  useEffect(() => {
    getAllJenisInventaris();
    getAllRuang();
  }, []);

  const defaultValue = {
    nama: initialData?.nama,
    quantity: initialData?.quantity || 0,
    hargaBeli: initialData?.hargaBeli || 0,
    waktuPengadaan: initialData?.waktuPengadaan
      ? new Date(initialData.waktuPengadaan).toISOString().split('T')[0] // Konversi ke Date dulu
      : '',
    keterangan: initialData?.keterangan,
    ruang: initialData?.ruang
  };

  const form = useForm({
    defaultValues: defaultValue
  });
  const { data: session } = useSession();

  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await api.put(
            `inventaris/update/${id}`,
            { ...values },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
          toast.success('Data jenis inventaris berhasil diubah');
        } else {
          await api.post(
            `inventaris/create`,
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
          toast.success('Data jenis inventaris berhasil disimpan');
        }

        router.push('/dashboard/inventaris/daftar-inventaris');
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

                <FormField
                  control={form.control}
                  name='nama'
                  rules={{ required: 'Nama Inventaris wajib dipilih' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Jenis Inventaris</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select an option' />
                          </SelectTrigger>
                          <SelectContent>
                            {JenisInventaris.length > 0 ? (
                              JenisInventaris.map((item) => (
                                <SelectItem key={item.id} value={item.nama}>
                                  {item.nama}
                                </SelectItem>
                              ))
                            ) : (
                              <p>Loading...</p>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='ruang'
                  rules={{ required: 'Ruangan wajib dipilih' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Ruangan</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select an option' />
                          </SelectTrigger>
                          <SelectContent>
                            {ruang.length > 0 ? (
                              ruang.map((item, i) => (
                                <SelectItem
                                  key={item.id ? item.id : `ruang-${i}`}
                                  value={item.nama}
                                >
                                  {item.nama}
                                </SelectItem>
                              ))
                            ) : (
                              <p>Loading...</p>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan Quantity...'
                      {...form.register('quantity', {
                        required: 'Jumlah Anggaran wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.quantity?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Harga Beli</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan Harga Beli...'
                      {...form.register('hargaBeli', {
                        required: 'Harga beli wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.hargaBeli?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Tanggal Pengadaan</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      placeholder='Masukkan Tanggal Anggaran...'
                      {...form.register('waktuPengadaan', {
                        required: 'Tanggal wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.waktuPengadaan?.message}
                  </FormMessage>
                </FormItem>
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
