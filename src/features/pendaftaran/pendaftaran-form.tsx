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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
import * as z from 'zod';
import { S } from '@faker-js/faker/dist/airline-BcEu2nRk';
import { API } from '@/lib/server';

// Tipe Data Siswa
export type Pendaftaran = {
  id: string;
  studentName: string;
  parentName: string;
  yourLocation: string;
  phoneNumber: string;
  email: string;
};

export default function PendaftaranForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Pendaftaran | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const [img, setImg] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Default Values dengan Fallback
  const defaultValue = {
    studentName: initialData?.studentName ?? '',
    parentName: initialData?.parentName ?? '',
    yourLocation: initialData?.yourLocation ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    email: initialData?.email ?? ''
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
      setImg(file);
    }
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  // Handle Submit
  async function onSubmit(values: any) {
    console.log(values.noTeleponOrtu);

    startTransition(async () => {
      try {
        const data = new FormData();
        if (img) {
          data.append('foto', img);
        }
        console.log(img);

        if (id !== 'new') {
          await axios.put(`${API}pendaftaran/${id}`, { ...values });
          toast.success('Data siswa berhasil diubah');
        } else {
          await axios.post(`${API}pendaftaran`, {
            ...values
          });
          toast.success('Data siswa berhasil disimpan');
        }

        router.push('/dashboard/pendaftaran');
      } catch (error) {
        toast.error(error?.response.data.message);
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
                {/* id */}
                <FormItem>
                  <FormLabel>Nama Calon Peserta Didik</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Nama Calon Peserta Didik...'
                      {...form.register('studentName', {
                        required: 'Nama wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.studentName?.message}
                  </FormMessage>
                </FormItem>

                {/* NIK */}
                <FormItem>
                  <FormLabel>Nama Wali Murid</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Orang Tua...'
                      {...form.register('parentName', {
                        required: 'Nama Orang Tua wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.parentName?.message}
                  </FormMessage>
                </FormItem>

                {/* Nama */}
                <FormItem>
                  <FormLabel>Tempat Tinggal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Alamat Lengkap...'
                      {...form.register('yourLocation', {
                        required: 'Alamat wajib diisi',
                        minLength: {
                          value: 3,
                          message: 'Nama minimal 3 karakter'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.yourLocation?.message}
                  </FormMessage>
                </FormItem>

                {/* Jurusan */}
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Email...'
                      {...form.register('email', {
                        required: 'Email Wajib Diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>

                {/* No Telepon */}
                <FormItem>
                  <FormLabel>No Telepon</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan No Telepon...'
                      {...form.register('phoneNumber', {
                        required: 'No telepon wajib diisi',
                        pattern: {
                          value: /^[0-9]{10,13}$/,
                          message: 'No telepon harus 10-13 digit angka'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.phoneNumber?.message}
                  </FormMessage>
                </FormItem>

                {/* Email */}
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
