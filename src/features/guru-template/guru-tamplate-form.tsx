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

// Tipe Data Guru Template
export type GuruTemplate = {
  name: string;
  image: string;
};

export default function GuruTemplateForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: GuruTemplate | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const { data: session } = useSession();

  const token = session?.user?.token;
  const router = useRouter();

  const defaultValue = {
    name: initialData?.name || '',
    image: initialData?.image || ''
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  // Handle Form Submission
  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        if (values.image[0]) {
          formData.append('image', values.image[0]);
        }

        if (id !== 'new') {
          await axios.put(`${API}guru-template/update/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          toast.success('Guru Template berhasil diperbarui');
        } else {
          await axios.post(`${API}guru-template/create`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}` // Ensure proper content type for file upload
            }
          });
          toast.success('Guru Template berhasil disimpan');
        }

        router.push('/dashboard/master-data/guru-template');
      } catch (error) {
        const axiosError = error as AxiosError;
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
                {/* Name */}
                <FormItem>
                  <FormLabel>Nama Guru</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Nama Guru...'
                      {...form.register('name', {
                        required: 'Nama Guru wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
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
