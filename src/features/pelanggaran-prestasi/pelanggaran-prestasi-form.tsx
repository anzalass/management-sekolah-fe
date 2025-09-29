'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

type PelanggaranForm = {
  idSiswa: string;
  namaSiswa: string;
  waktu: string;
  poin: number;
  jenis: string;
  keterangan: string;
};

type Siswa = {
  id: string;
  nama: string;
};

export default function PelanggaranPrestasiForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: PelanggaranForm | null;
  id: string;
  pageTitle: string;
}) {
  const { data: session } = useSession();
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [open, setOpen] = useState(false);

  const defaultValue = {
    idSiswa: initialData?.idSiswa || '',
    namaSiswa: initialData?.namaSiswa || '',
    waktu: initialData?.waktu ? initialData.waktu.split('.')[0] : '',
    poin: initialData?.poin || 0,
    jenis: initialData?.jenis || '',
    keterangan: initialData?.keterangan || ''
  };

  const form = useForm<PelanggaranForm>({
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

  useEffect(() => {
    if (initialData) {
      form.reset({
        idSiswa: initialData.idSiswa,
        namaSiswa: initialData.namaSiswa,
        waktu: initialData.waktu ? initialData.waktu.split('T')[0] : '',
        poin: initialData.poin,
        jenis: initialData.jenis,
        keterangan: initialData.keterangan
      });
    }
  }, [initialData, form]);

  async function onSubmit(values: PelanggaranForm) {
    startTransition(async () => {
      try {
        const payload = {
          ...values,
          poin: Number(values.poin),
          waktu: new Date(values.waktu).toISOString()
        };

        if (id !== 'new') {
          await api.put(`pelanggaran-prestasi/${id}`, payload, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data berhasil diperbarui');
        } else {
          await api.post(`pelanggaran-prestasi`, payload, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success('Data berhasil disimpan');
        }

        router.push('/dashboard/pelanggaran-prestasi');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
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
              {/* Autocomplete Siswa */}

              {initialData ? null : (
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
              )}

              {/* Waktu */}
              <FormItem>
                <FormLabel>Waktu</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    {...form.register('waktu', {
                      required: 'Waktu wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.waktu?.message}
                </FormMessage>
              </FormItem>

              {/* Poin */}
              <FormItem>
                <FormLabel>Poin</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...form.register('poin', {
                      required: 'Poin wajib diisi',
                      valueAsNumber: true
                    })}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.poin?.message}</FormMessage>
              </FormItem>

              {/* Jenis */}
              <FormItem>
                <FormLabel>Jenis</FormLabel>
                <Select
                  onValueChange={(val) => form.setValue('jenis', val)}
                  defaultValue={form.watch('jenis')}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih jenis' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Pelanggaran'>Pelanggaran</SelectItem>
                    <SelectItem value='Prestasi'>Prestasi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage>
                  {form.formState.errors.jenis?.message}
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
