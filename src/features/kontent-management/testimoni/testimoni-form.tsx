'use client';

import { useEffect, useState } from 'react';

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
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

type Testimonial = {
  parentName: string;
  description: string;
  image: string;
};

type FormValues = {
  parentName: string;
  description: string;
  image: FileList;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function TestimonialForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Testimonial | null;
  id: string;
  pageTitle: string;
}) {
  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null
  );

  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const form = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      parentName: initialData?.parentName || '',
      description: initialData?.description || ''
    }
  });

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('parentName', values.parentName);
        formData.append('description', values.description);

        if (values.image && values.image.length > 0) {
          formData.append('image', values.image[0]);
        }

        if (id !== 'new') {
          await api.put(`testimonials/update/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Testimoni berhasil diperbarui');
        } else {
          await api.post(`testimonials/create`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Testimoni berhasil disimpan');
        }

        router.push('/dashboard/content-management/testimoni');
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* PARENT NAME */}
            <FormField
              control={form.control}
              name='parentName'
              rules={{
                required: 'Nama orang tua wajib diisi'
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Orang Tua</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan nama orang tua...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name='description'
              rules={{
                required: 'Deskripsi testimoni wajib diisi'
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Testimoni</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan deskripsi testimoni...'
                      className='min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IMAGE */}
            <FormField
              control={form.control}
              name='image'
              rules={{
                validate: (files) => {
                  // CREATE → wajib
                  if (id === 'new' && (!files || files.length === 0)) {
                    return 'Gambar wajib diupload';
                  }

                  // UPDATE → optional
                  if (!files || files.length === 0) return true;

                  const file = files[0];

                  if (!ALLOWED_TYPES.includes(file.type)) {
                    return 'Format gambar harus JPG, JPEG, atau PNG';
                  }

                  if (file.size > MAX_FILE_SIZE) {
                    return 'Ukuran gambar maksimal 1 MB';
                  }

                  return true;
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>

                  {/* PREVIEW (lama & baru) */}
                  {preview && (
                    <div className='mb-3'>
                      <img
                        src={preview}
                        alt='Preview'
                        className='h-40 w-full rounded-md border object-cover'
                      />
                      {id !== 'new' && !form.watch('image')?.length && (
                        <p className='mt-1 text-xs text-muted-foreground'>
                          Gambar lama (upload file baru untuk mengganti)
                        </p>
                      )}
                    </div>
                  )}

                  <FormControl>
                    <Input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png'
                      onChange={(e) => {
                        const files = e.target.files;
                        field.onChange(files);

                        if (files && files[0]) {
                          // 🔥 preview LANGSUNG ganti
                          const objectUrl = URL.createObjectURL(files[0]);
                          setPreview(objectUrl);
                        }
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
