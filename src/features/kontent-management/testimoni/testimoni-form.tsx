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
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';

export type Testimonial = {
  parentName: string;
  description: string;
  image: string;
};

export default function TestimonialForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Testimonial | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const defaultValue = {
    description: initialData?.description || '',
    image: initialData?.image || '',
    parentName: initialData?.parentName || ''
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  // Handle Form Submission
  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('description', values.description);
        formData.append('parentName', values.parentName);
        if (values.image[0]) {
          formData.append('image', values.image[0]);
        }

        if (id !== 'new') {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}testimonials/update/${id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          toast.success('Testimoni berhasil diperbarui');
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}testimonials/create`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          toast.success('Testimoni berhasil disimpan');
        }

        router.push('/dashboard/content-management/testimoni');
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
                <FormItem>
                  <FormLabel>Nama Orang Tua</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Orang Tua...'
                      {...form.register('parentName', {
                        required: 'Nama Orang Tua wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.description?.message}
                  </FormMessage>
                </FormItem>
                {/* Description */}
                <FormItem>
                  <FormLabel>Deskripsi Testimoni</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Deskripsi Testimoni...'
                      {...form.register('description', {
                        required: 'Deskripsi wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.description?.message}
                  </FormMessage>
                </FormItem>

                {/* Image */}
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <FormControl>
                    <Input type='file' {...form.register('image')} />
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
