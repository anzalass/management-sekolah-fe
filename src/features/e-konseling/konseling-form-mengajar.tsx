'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/lib/server';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Konseling = {
  idSiswa: string;
  namaSiswa: string;
  tanggal: string;
  keterangan: string;
  kategori: string;
};

type Siswa = {
  id: string;
  nama: string;
};

export default function KonselingFormMengajar({
  initialData,
  id,
  pageTitle
}: {
  initialData: Konseling | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const defaultValue = {
    idSiswa: initialData?.idSiswa || '',
    namaSiswa: initialData?.namaSiswa || '',
    tanggal: initialData?.tanggal ? initialData.tanggal.split('T')[0] : '',
    keterangan: initialData?.keterangan || '',
    kategoti: initialData?.kategori || ''
  };

  const form = useForm<Konseling>({
    defaultValues: defaultValue
  });

  useEffect(() => {
    api
      .get(`user/get-all-siswa-master`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      })
      .then((res) => {
        setSiswaList(res.data.result.data);
      });
  }, []);

  async function onSubmit(values: Konseling) {
    startTransition(async () => {
      try {
        const payload = {
          ...values
        };

        if (id !== 'new') {
          await api.put(`konseling/${id}`, payload, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data konseling berhasil diperbarui');
        } else {
          await api.post(`konseling/`, payload, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data konseling berhasil disimpan');
        }

        router.push('/mengajar/e-konseling/konseling-siswa');
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
              {/* Autocomplete Siswa */}
              <FormItem>
                <FormLabel>Siswa</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-full justify-between',
                          !form.watch('namaSiswa') && 'text-muted-foreground'
                        )}
                      >
                        {form.watch('namaSiswa') || 'Pilih siswa...'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[300px] p-0'>
                    <Command>
                      <CommandInput placeholder='Cari siswa...' />
                      <CommandList>
                        <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {siswaList.map((s) => (
                            <CommandItem
                              key={s.id}
                              value={s.nama}
                              onSelect={() => {
                                form.setValue('idSiswa', s.id);
                                form.setValue('namaSiswa', s.nama);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  s.id === form.watch('idSiswa')
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {s.nama}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage>
                  {form.formState.errors.idSiswa?.message}
                </FormMessage>
              </FormItem>

              {/* Tanggal */}
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    {...form.register('tanggal', {
                      required: 'Tanggal wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.tanggal?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => form.setValue('kategori', value)}
                    defaultValue={form.getValues('kategori')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih kategori' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='akademik'>Akademik</SelectItem>
                      <SelectItem value='sosial'>Sosial</SelectItem>
                      <SelectItem value='keluarga'>Keluarga</SelectItem>
                      <SelectItem value='karir'>Karir</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.kategori?.message}
                </FormMessage>
              </FormItem>

              {/* Keterangan */}
              <FormItem className='md:col-span-2'>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Masukkan keterangan...'
                    {...form.register('keterangan', {
                      required: 'Keterangan wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.keterangan?.message}
                </FormMessage>
              </FormItem>
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
