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
import { Check, Loader2 } from 'lucide-react';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Buku } from '../e-perpus/buku-tables/columns';

type PinjamBuku = {
  idSiswa: string;
  namaBuku: string;
  namaSiswa: string;
  nisSiswa: string;
  idBuku: string;
  waktuPinjam: string;
  waktuKembali: string;
  keterangan?: string;
};

type Siswa = {
  id: string;
  nis: string;
  nama: string;
};

export default function PinjamBukuForm({ pageTitle }: { pageTitle: string }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [open, setOpen] = useState(false);
  const [openBuku, setOpenBuku] = useState(false);

  const [dataBuku, setDataBuku] = useState<Buku[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}user/get-all-siswa`)
      .then((res) => {
        setSiswaList(res.data.result.data);
      });

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}buku`).then((res) => {
      setDataBuku(res.data.data);
    });
  }, []);

  const form = useForm<PinjamBuku>({
    defaultValues: {
      idSiswa: '',
      namaSiswa: '',
      nisSiswa: '',
      idBuku: '',
      namaBuku: '',
      waktuPinjam: new Date().toISOString().split('T')[0], // default hari ini
      waktuKembali: '',
      keterangan: ''
    }
  });

  async function onSubmit(values: PinjamBuku) {
    startTransition(async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}peminjaman`,
          values,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        toast.success('Peminjaman buku berhasil disimpan');
        router.push('/dashboard/e-perpus/peminjaman');
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
              {/* NIS Siswa */}
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
                                form.setValue('nisSiswa', s.nis);

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

              <FormItem>
                <FormLabel>Buku</FormLabel>
                <Popover open={openBuku} onOpenChange={setOpenBuku}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-full justify-between',
                          !form.watch('namaBuku') && 'text-muted-foreground'
                        )}
                      >
                        {form.watch('namaBuku') || 'Pilih buku...'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[300px] p-0'>
                    <Command>
                      <CommandInput placeholder='Cari buku...' />
                      <CommandList>
                        <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {dataBuku.map((s) => (
                            <CommandItem
                              key={s.id}
                              value={s.nama}
                              onSelect={() => {
                                form.setValue('idBuku', s.id);
                                form.setValue('namaBuku', s.nama);

                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  s.id === form.watch('idBuku')
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
                  {form.formState.errors.idBuku?.message}
                </FormMessage>
              </FormItem>

              {/* Waktu Pinjam */}
              <FormItem>
                <FormLabel>Waktu Pinjam</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    {...form.register('waktuPinjam', {
                      required: 'Waktu pinjam wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.waktuPinjam?.message}
                </FormMessage>
              </FormItem>

              {/* Waktu Kembali */}
              <FormItem>
                <FormLabel>Waktu Kembali</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    {...form.register('waktuKembali', {
                      required: 'Waktu kembali wajib diisi'
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.waktuKembali?.message}
                </FormMessage>
              </FormItem>

              {/* Keterangan */}
              <FormItem className='md:col-span-2'>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Masukkan keterangan peminjaman...'
                    {...form.register('keterangan')}
                  />
                </FormControl>
              </FormItem>
            </div>

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
