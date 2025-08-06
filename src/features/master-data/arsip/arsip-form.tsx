'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm } from 'react-hook-form';

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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { API } from '@/lib/server';

export type Arsip = {
  namaBerkas: string;
  keterangan: string;
  pdf?: FileList; // Tambahan: untuk PDF
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
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Arsip>({
    defaultValues: {
      namaBerkas: initialData?.namaBerkas || '',
      keterangan: initialData?.keterangan || ''
    }
  });

  // Submit handler
  async function onSubmit(values: Arsip) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('namaBerkas', values.namaBerkas);
        formData.append('keterangan', values.keterangan);
        if (values.pdf && values.pdf.length > 0) {
          formData.append('file', values.pdf[0]);
        }

        if (id !== 'new') {
          await axios.put(`${API}ruang/update/${id}`, formData);
          toast.success('Data Arsip berhasil diubah');
        } else {
          await axios.post(`${API}arsip`, formData);
          toast.success('Data Arsip berhasil disimpan');
        }

        router.push('/dashboard/master-data/arsip');
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan'
        );
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Nama Arsip */}
              <FormField
                control={form.control}
                name='namaBerkas'
                rules={{
                  required: 'Nama Berkas wajib diisi',
                  minLength: {
                    value: 3,
                    message: 'Minimal 3 karakter'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Berkas</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan Nama Arsip...' {...field} />
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
                      <Textarea
                        placeholder='Masukkan Keterangan...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PDF File */}
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
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
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
