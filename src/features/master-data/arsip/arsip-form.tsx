'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export type Arsip = {
  namaBerkas: string;
  keterangan: string;
  pdf?: FileList | null;
};

export default function RuanganForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Arsip | null;
  id: string;
  pageTitle: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, startTransition] = useTransition();

  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const form = useForm<Arsip>({
    defaultValues: {
      namaBerkas: initialData?.namaBerkas || '',
      keterangan: initialData?.keterangan || '',
      pdf: null
    }
  });

  async function onSubmit(values: Arsip) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('namaBerkas', values.namaBerkas);
        formData.append('keterangan', values.keterangan);

        if (values.pdf && values.pdf.length > 0) {
          formData.append('file', values.pdf[0]);
        }

        const config = {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          },
          onUploadProgress: (e: any) => {
            if (e.total) {
              const percent = Math.round((e.loaded * 100) / e.total);
              setProgress(percent);
            }
          }
        };

        if (id !== 'new') {
          await api.put(`ruang/update/${id}`, formData, config);
          toast.success('Data Arsip berhasil diubah');
        } else {
          await api.post(`arsip`, formData, config);
          toast.success('Data Arsip berhasil disimpan');
        }

        router.push('/dashboard/master-data/arsip');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setProgress(0);
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
            {/* Nama Berkas */}
            <FormField
              control={form.control}
              name='namaBerkas'
              rules={{ required: 'Nama Berkas wajib diisi' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Berkas</FormLabel>
                  <FormControl>
                    <Input placeholder='Nama arsip...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Keterangan */}
            <FormField
              control={form.control}
              name='keterangan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Keterangan...' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Upload PDF */}
            <FormField
              control={form.control}
              name='pdf'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload PDF</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='application/pdf'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (file.type !== 'application/pdf') {
                          toast.error('Hanya file PDF yang diperbolehkan');
                          return;
                        }

                        field.onChange(e.target.files);
                        setPdfPreview(URL.createObjectURL(file));
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Progress Bar */}
            {progress > 0 && (
              <div className='space-y-2'>
                <Progress value={progress} />
                <p className='text-sm text-muted-foreground'>
                  Uploading... {progress}%
                </p>
              </div>
            )}

            {/* Submit */}
            <Button type='submit' disabled={loading} className='w-full'>
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
