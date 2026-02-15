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
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

type FormValues = {
  image: FileList;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function GalleryForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: { image: string } | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    mode: 'onSubmit'
  });

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData();

        if (values.image && values.image.length > 0) {
          formData.append('image', values.image[0]);
        }

        if (id !== 'new') {
          await api.put(`gallery/update/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Gallery berhasil diperbarui');
        } else {
          await api.post('gallery/create', formData, {
            headers: {
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
        <CardTitle className='text-xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='image'
              rules={{
                validate: (files) => {
                  // CREATE → wajib
                  if (id === 'new' && (!files || files.length === 0)) {
                    return 'Gambar tidak boleh kosong';
                  }

                  // UPDATE → kosong = OK
                  if (!files || files.length === 0) {
                    return true;
                  }

                  const file = files[0];

                  // Validasi tipe
                  if (!ALLOWED_TYPES.includes(file.type)) {
                    return 'Format gambar harus JPG, JPEG, atau PNG';
                  }

                  // Validasi ukuran
                  if (file.size > MAX_FILE_SIZE) {
                    return 'Ukuran gambar maksimal 1 MB';
                  }

                  return true;
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>

                  {/* Preview lama */}
                  {initialData?.image && id !== 'new' && (
                    <div className='mb-3'>
                      <img
                        src={initialData.image}
                        alt='Preview'
                        className='h-40 rounded-md border object-cover'
                      />
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Kosongkan jika tidak ingin mengganti gambar
                      </p>
                    </div>
                  )}

                  <FormControl>
                    <Input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png'
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>

                  {/* 🔥 ERROR MUNCUL DI SINI */}
                  <FormMessage />
                </FormItem>
              )}
            />

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
