'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { StepBack, Menu } from 'lucide-react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import TextEditor from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import BottomNav from '../bottom-nav';
import NavbarSiswa from '../navbar-siswa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Summary {
  id: string;
  nama: string;
  idSiswa: string;
  content: string;
  fotoSiswa?: string;
  waktu: string;
}

interface Materi {
  id: string;
  judul: string;
  konten: string;
  iframeGoogleSlide?: string;
  iframeYoutube?: string;
  pdfUrl?: string;
  past: any;
  SummaryMateri: Summary[];
}

type IDMateri = {
  idMateri: string;
  idKelas: string;
};

export default function DetailMateriView({ idMateri, idKelas }: IDMateri) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { konten: '' }
  });

  const {
    data: materi,
    isLoading,
    error
  } = useQuery<Materi>({
    queryKey: ['materi', idMateri],
    queryFn: async () => {
      const res = await api.get(`materi-summary/${idMateri}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  const { data: listMateri } = useQuery<Materi[]>({
    queryKey: ['listMateri', idKelas],
    queryFn: async () => {
      const res = await api.get(`kelas-mapel/${idKelas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data.MateriMapel || [];
    },
    enabled: !!session?.user?.token
  });

  const addSummaryMutation = useMutation({
    mutationFn: async (data: { konten: string }) => {
      await api.post(
        `summary`,
        {
          idSiswa: session?.user?.idGuru,
          idMateri,
          idKelasMapel: idKelas,
          content: data.konten,
          waktu: new Date()
        },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Ringkasan berhasil disimpan');
      reset();
      queryClient.invalidateQueries({ queryKey: ['materi', idMateri] });
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan ringkasan');
    }
  });

  const onSubmit = (data: { konten: string }) => {
    addSummaryMutation.mutate(data);
  };

  if (isLoading) return <p className='p-4 text-center'>Loading...</p>;
  if (error)
    return <p className='p-4 text-center text-red-500'>Error loading materi</p>;

  return (
    <div className='mb-14 w-full space-y-6'>
      {/* Header */}
      <div className='relative flex h-[10vh] w-full items-center justify-between rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        <div className='flex items-center gap-3'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-white md:hidden'
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-64'>
              <SheetHeader>
                <SheetTitle>Daftar Materi</SheetTitle>
              </SheetHeader>
              <ScrollArea className='h-full'>
                <div className='space-y-2'>
                  {listMateri?.map((m) => (
                    <Link
                      key={m.id}
                      href={`/siswa/kelas/${idKelas}/materi/${m.id}`}
                    >
                      <button
                        className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${
                          m.id === idMateri ? 'bg-muted font-semibold' : ''
                        }`}
                      >
                        {m.judul}
                      </button>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Link href={'/siswa/kelas'}>
            <button className='flex items-center gap-1 text-white hover:opacity-80'>
              <StepBack />
            </button>
          </Link>
        </div>

        <h1 className='text-lg font-semibold'>{materi?.judul}</h1>

        <div className='h-10 w-10 overflow-hidden rounded-full border-2 border-white'>
          <Image
            src={`https://ui-avatars.com/api/?name=${
              session?.user?.nama?.split(' ')[0]?.[0] || ''
            }+${session?.user?.nama?.split(' ')[1]?.[0] || ''}&background=random&format=png`}
            alt='Foto User'
            width={100}
            height={100}
            className='h-full w-full object-cover'
          />
        </div>
      </div>

      {/* Layout */}
      <div className='mx-auto grid w-[95%] grid-cols-1 gap-6 md:grid-cols-12'>
        {/* Sidebar */}
        <div className='hidden md:col-span-3 md:block'>
          <div className='sticky top-3'>
            <Card className='flex h-[80vh] flex-col'>
              <CardHeader>
                <CardTitle>📂 Daftar Materi</CardTitle>
              </CardHeader>
              <CardContent className='flex-1 overflow-hidden'>
                <ScrollArea className='h-full'>
                  <div className='space-y-2'>
                    {listMateri?.map((m) => (
                      <label
                        key={m.id}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted ${
                          m.id === idMateri ? 'bg-muted font-semibold' : ''
                        }`}
                      >
                        <span
                          onClick={() =>
                            (window.location.href = `/siswa/kelas/${idKelas}/materi/${m.id}`)
                          }
                        >
                          {m.judul}
                        </span>
                        <Checkbox checked={m.past} />
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Konten Materi */}
        <div className='md:col-span-6'>
          <Card className='p-2'>
            <CardHeader>
              <CardTitle>📘 {materi?.judul}</CardTitle>
            </CardHeader>
            <CardContent className='prose max-w-none dark:prose-invert'>
              <div dangerouslySetInnerHTML={{ __html: materi?.konten || '' }} />
              {materi?.iframeYoutube && (
                <div
                  className='mx-auto mb-10 w-[50%]'
                  dangerouslySetInnerHTML={{ __html: materi?.iframeYoutube }}
                />
              )}
              {materi?.iframeGoogleSlide && (
                <div
                  className='w-[50%]'
                  dangerouslySetInnerHTML={{
                    __html: materi?.iframeGoogleSlide
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ringkasan */}
        <div className='md:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle>📋 Ringkasan Saya</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {materi?.SummaryMateri?.filter(
                (s) => s.idSiswa === session?.user?.idGuru
              ).length === 0 && (
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                  <label className='mb-1 block text-sm font-medium'>
                    Summary
                  </label>
                  <Controller
                    name='konten'
                    control={control}
                    render={({ field }) => (
                      <TextEditor
                        type='materi'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Button type='submit' className='mt-2 w-full'>
                    Simpan Ringkasan
                  </Button>
                </form>
              )}
              <ScrollArea className='max-h-[300px] pr-2'>
                <div className='space-y-4'>
                  {materi?.SummaryMateri?.filter(
                    (s) => s.idSiswa === session?.user?.idGuru
                  ).map((s) => (
                    <div
                      key={s.id}
                      className='flex gap-4 rounded-md border p-3 shadow-sm transition hover:bg-muted/50'
                    >
                      <Avatar>
                        <AvatarImage src={s.fotoSiswa} />
                        <AvatarFallback>{s.nama.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className='space-y-1'>
                        <div className='text-sm font-semibold'>{s.nama}</div>
                        <div
                          className='prose max-w-none text-sm text-muted-foreground'
                          dangerouslySetInnerHTML={{ __html: s.content }}
                        />
                        <p className='text-xs text-muted-foreground'>
                          {s.waktu}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
