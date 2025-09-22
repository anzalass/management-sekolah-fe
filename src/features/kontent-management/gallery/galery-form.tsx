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
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

// Tipe Data Gallery
export type Gallery = {
  image: string;
};

export default function GalleryForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Gallery | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const defaultValue = {
    image: initialData?.image || ''
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (values.image[0]) {
          formData.append('image', values.image[0]);
        }

        if (id !== 'new') {
          await api.put(`gallery/update/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Gallery berhasil diperbarui');
        } else {
          await api.post(`gallery/create`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Gallery berhasil disimpan');
        }

        router.push('/dashboard/content-management/gallery');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
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
