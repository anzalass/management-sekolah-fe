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
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

export type GuruTemplate = {
  name: string;
  image: string;
};

type FormValues = {
  name: string;
  image?: FileList;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

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
  const router = useRouter();

  const isEdit = id !== 'new';

  // 🔥 preview state (lama & baru)
  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null
  );

  const form = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: initialData?.name || ''
    }
  });

  // 🧹 cleanup blob url
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);

        if (values.image && values.image.length > 0) {
          formData.append('image', values.image[0]);
        }

        if (isEdit) {
          await api.put(`guru-template/update/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Guru Template berhasil diperbarui');
        } else {
          await api.post(`guru-template/create`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Guru Template berhasil disimpan');
        }

        router.push('/dashboard/content-management/guru-template');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    });
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-xl font-bold md:text-2xl'>
          {pageTitle}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* NAMA GURU */}
              <FormItem>
                <FormLabel>Nama Guru</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan Nama Guru...'
                    {...form.register('name', {
                      required: 'Nama Guru wajib diisi',
                      minLength: {
                        value: 3,
                        message: 'Nama minimal 3 karakter'
                      }
                    })}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>

              {/* IMAGE */}
              <FormItem>
                <FormLabel>Gambar</FormLabel>

                {/* PREVIEW */}
                {preview && (
                  <div className='mb-3'>
                    <img
                      src={preview}
                      alt='Preview'
                      className='h-40 w-full rounded-md border object-cover'
                    />
                    {isEdit && !form.watch('image')?.length && (
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Gambar lama (upload gambar baru untuk mengganti)
                      </p>
                    )}
                  </div>
                )}

                <FormControl>
                  <Input
                    type='file'
                    accept='image/jpeg,image/png,image/jpg'
                    onChange={(e) => {
                      const files = e.target.files;

                      // 1️⃣ set ke react-hook-form
                      form.setValue('image', files as FileList, {
                        shouldValidate: true
                      });

                      // 2️⃣ set preview (🔥 INI YANG SEBELUMNYA SALAH)
                      if (files && files[0]) {
                        const objectUrl = URL.createObjectURL(files[0]);
                        setPreview(objectUrl);
                      }
                    }}
                  />
                </FormControl>

                <FormMessage>
                  {form.formState.errors.image?.message}
                </FormMessage>
              </FormItem>
            </div>

            {/* SUBMIT */}
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
