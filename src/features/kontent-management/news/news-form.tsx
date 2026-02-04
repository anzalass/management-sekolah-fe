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
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

type News = {
  title: string;
  content: string;
  image: string;
};

type FormValues = {
  title: string;
  content: string;
  image?: FileList;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

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

  const isEdit = id !== 'new';

  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null
  );

  const form = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || ''
    }
  });

  // cleanup object URL
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
        formData.append('title', values.title);
        formData.append('content', values.content);

        if (values.image && values.image.length > 0) {
          formData.append('image', values.image[0]);
        }

        if (isEdit) {
          await api.put(`news/update/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Berita berhasil diperbarui');
        } else {
          await api.post('news/create', formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Berita berhasil disimpan');
        }

        router.push('/dashboard/content-management/news');
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
            {/* TITLE */}
            <FormField
              control={form.control}
              name='title'
              rules={{
                required: 'Judul berita wajib diisi',
                minLength: {
                  value: 6,
                  message: 'Judul minimal 6 karakter'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Berita</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan judul berita...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONTENT */}
            <FormField
              control={form.control}
              name='content'
              rules={{
                required: 'Konten berita wajib diisi'
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten Berita</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan konten berita...'
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
                  if (!isEdit && (!files || files.length === 0)) {
                    return 'Gambar wajib diupload';
                  }

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
                          // 🔥 LANGSUNG GANTI PREVIEW
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
