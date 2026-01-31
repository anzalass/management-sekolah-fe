'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Loader2, Trash } from 'lucide-react';
import { toast } from 'sonner';

import api from '@/lib/api';
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
import RichTextEditor from '../texteditor/textEditor';

export type Pengumuman = {
  id: string;
  title: string;
  time: Date;
  content: string;
  fotoUrl?: string | null;
  fotoId?: string | null;
};

type FormValues = {
  title: string;
  time: string;
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
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, startTransition] = useTransition();

  const [content, setContent] = useState(initialData?.content || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.fotoUrl || null
  );

  const form = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || '',
      time: initialData?.time
        ? new Date(initialData.time).toISOString().split('T')[0]
        : ''
    }
  });

  /** HANDLE IMAGE SELECT */
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /** REMOVE IMAGE */
  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  /** SUBMIT */
  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('time', values.time);
        formData.append('content', content);

        // kirim image hanya jika user upload baru
        if (file) {
          formData.append('image', file);
        }

        if (id !== 'new') {
          await api.put(`pengumuman/update/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Pengumuman berhasil diubah');
        } else {
          await api.post(`pengumuman/create`, formData, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Pengumuman berhasil ditambahkan');
        }

        router.push('/dashboard/master-data/pengumuman');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
      }
    });
  };

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
            {/* IMAGE UPLOAD */}
            <div className='space-y-3'>
              <FormLabel>Header Image</FormLabel>

              {preview ? (
                <div className='relative w-full overflow-hidden rounded-xl border'>
                  <Image
                    src={preview}
                    alt='Preview'
                    width={1200}
                    height={400}
                    className='h-[260px] w-full object-cover'
                  />

                  <Button
                    type='button'
                    size='icon'
                    variant='destructive'
                    onClick={removeImage}
                    className='absolute right-3 top-3'
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              ) : (
                <label className='flex h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-sm text-muted-foreground hover:bg-muted/40'>
                  <span>Click untuk upload gambar</span>
                  <span className='text-xs'>PNG / JPG / JPEG</span>
                  <Input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleSelectImage}
                  />
                </label>
              )}
            </div>

            {/* FORM */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='title'
                rules={{ required: 'Judul wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input placeholder='Judul pengumuman...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='time'
                rules={{ required: 'Tanggal wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CONTENT */}
            <div className='space-y-2'>
              <FormLabel>Isi Pengumuman</FormLabel>
              <RichTextEditor content={content} onChange={setContent} />
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
