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
import { useState, useTransition } from 'react';
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
import { title } from 'process';
import RichTextEditor from '../texteditor/textEditor';

// Tipe Data Siswa
export type Pengumuman = {
  id: string;
  title: string;
  time: Date;
  content: string;
};

export default function PengumumanForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Pengumuman | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const defaultValue = {
    title: initialData?.title,
    time: initialData?.time
      ? new Date(initialData.time).toISOString().split('T')[0] // Konversi ke Date dulu
      : '',
    content: initialData?.content
  };

  const [content, setContent] = useState(initialData?.content || '');

  const form = useForm({
    defaultValues: defaultValue
  });

  // Handle Submit
  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await axios.put(
            `${API}pengumuman/update/${id}`,
            {
              ...values,
              content: content
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data pengumuman berhasil diubah');
        } else {
          await axios.post(
            `${API}pengumuman/create`,
            {
              ...values,
              content: content
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          toast.success('Data pengumuman berhasil disimpan');
        }
        router.push('/dashboard/master-data/pengumuman');
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
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Judul...'
                      {...form.register('title', {
                        required: 'Judul wajib diisi',
                        minLength: {
                          value: 6,
                          message: 'Minimal panjang 6 karakter'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.title?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Tanggal Pengumuman</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      placeholder='Masukkan Tanggal Pengumuman...'
                      {...form.register('time', {
                        required: 'Tanggal wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.time?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <RichTextEditor content={content} onChange={setContent} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.content?.message}
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
