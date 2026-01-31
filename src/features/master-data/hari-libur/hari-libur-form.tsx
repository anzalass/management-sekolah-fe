'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import api from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

export type HariLibur = {
  namaHari: string;
  tahunAjaran: string;
  tanggal: string; // ISO string dari input type="date"
};

export default function HariLiburForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: HariLibur | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<HariLibur>({
    defaultValues: {
      namaHari: initialData?.namaHari || '',
      tahunAjaran: initialData?.tahunAjaran || '',
      tanggal: initialData?.tanggal || '' // format YYYY-MM-DD
    }
  });

  // =====================
  // SUBMIT HANDLER
  // =====================
  async function onSubmit(values: HariLibur) {
    startTransition(async () => {
      try {
        const payload = {
          namaHari: values.namaHari,
          tahunAjaran: values.tahunAjaran,
          tanggal: new Date(values.tanggal) // convert ke DateTime
        };

        if (id !== 'new') {
          await api.put(`hari-libur/${id}`, payload, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data Hari Libur berhasil diubah');
        } else {
          await api.post(`hari-libur`, payload, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data Hari Libur berhasil disimpan');
        }

        router.push('/dashboard/master-data/hari-libur');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    });
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-xl font-bold md:text-2xl'>
          {pageTitle}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Nama Hari Libur */}
              <FormField
                control={form.control}
                name='namaHari'
                rules={{
                  required: 'Nama hari libur wajib diisi',
                  minLength: {
                    value: 3,
                    message: 'Minimal 3 karakter'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Hari Libur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Contoh: Hari Raya Idul Fitri'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tanggal */}
              <FormField
                control={form.control}
                name='tanggal'
                rules={{
                  required: 'Tanggal wajib diisi'
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Libur</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={loading}
                className='min-w-[140px]'
              >
                {loading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  'Simpan'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
