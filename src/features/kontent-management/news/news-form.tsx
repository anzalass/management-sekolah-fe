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
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';

// Tipe Data News
export type News = {
  title: string;
  content: string;
  image: string;
};

export default function NewsForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: News | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const defaultValue = {
    title: initialData?.title || '',
    content: initialData?.content || '',
    image: initialData?.image || ''
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        if (values.image[0]) {
          formData.append('image', values.image[0]);
        }

        if (id !== 'new') {
          // Update existing news
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}news/update/${id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          toast.success('Berita berhasil diperbarui');
        } else {
          // Create new news
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}news/create`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          toast.success('Berita berhasil disimpan');
        }

        router.push('/dashboard/content-management/news');
      } catch (error) {
        const axiosError = error as any;
        const errorMessage =
          axiosError.response?.data?.message || 'Terjadi Kesalahan';
        toast.error(errorMessage);
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
            <div className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Title */}
                <FormItem>
                  <FormLabel>Judul Berita</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Judul Berita...'
                      {...form.register('title', {
                        required: 'Judul Berita wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.title?.message}
                  </FormMessage>
                </FormItem>

                {/* Content */}
                <FormItem>
                  <FormLabel>Konten Berita</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Konten Berita...'
                      {...form.register('content', {
                        required: 'Konten wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.content?.message}
                  </FormMessage>
                </FormItem>

                {/* Image */}
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <FormControl>
                    <Input type='file' {...form.register('image', {})} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.image?.message}
                  </FormMessage>
                </FormItem>
              </div>
            </div>

            {/* Submit Button */}
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
