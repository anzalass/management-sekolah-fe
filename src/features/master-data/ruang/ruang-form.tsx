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
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export type Ruangan = {
  nama: string;
  keterangan: string;
};

export default function RuanganForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Ruangan | null;
  id: string;
  pageTitle: string;
}) {
  const { data: session } = useSession();
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Ruangan>({
    defaultValues: {
      nama: initialData?.nama || '',
      keterangan: initialData?.keterangan || ''
    }
  });

  // Submit handler
  async function onSubmit(values: Ruangan) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await api.put(`ruang/update/${id}`, values, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data ruangan berhasil diubah');
        } else {
          await api.post(`ruang/create`, values, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data ruangan berhasil disimpan');
        }

        router.push('/dashboard/master-data/ruangan');
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Nama Ruangan */}
              <FormField
                control={form.control}
                name='nama'
                rules={{
                  required: 'Nama ruangan wajib diisi',
                  minLength: {
                    value: 3,
                    message: 'Minimal 3 karakter'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Ruangan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan Nama Ruangan...'
                        {...field}
                      />
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
