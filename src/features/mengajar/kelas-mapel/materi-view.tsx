'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Summary {
  id: number;
  nama: string;
  nisSiswa: string;
  content: any;
  fotoSiswa?: string;
  waktu: string;
}

interface Materi {
  judul: string;
  konten: any;
  iframeGoogleSlide: any;
  iframeYoutube: any;
  pdfUrl: string;
  SummaryMateri: Summary[];
}

type IDMateri = {
  id: string;
};

function stripHtml(html = '') {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function excerptFromHtml(html = '', maxLen = 120) {
  const text = stripHtml(html).trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '...';
}

export default function MateriView({ id }: IDMateri) {
  const { data: session } = useSession();
  const [openItem, setOpenItem] = useState<any>(null);

  // 🔹 React Query untuk fetch materi
  const {
    data: materi,
    isLoading,
    isError
  } = useQuery<Materi>({
    queryKey: ['materi-summary', id],
    queryFn: async () => {
      try {
        const response = await api.get(`materi-summary/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        throw error;
      }
    },
    enabled: !!session?.user?.token // hanya jalan kalau token sudah ada
  });

  if (isLoading) {
    return (
      <p className='text-center text-sm text-muted-foreground'>Loading...</p>
    );
  }

  if (isError || !materi) {
    return (
      <p className='text-center text-sm text-red-500'>
        Gagal memuat data materi
      </p>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Section Materi */}
      <Card>
        <CardHeader>
          <CardTitle>📘 {materi?.judul}</CardTitle>
        </CardHeader>
        <CardContent className='prose max-w-none dark:prose-invert'>
          <div dangerouslySetInnerHTML={{ __html: materi?.konten }} />
          <div className='mx-auto w-full items-center justify-center'>
            {materi?.iframeYoutube && (
              <div
                className='mx-auto mb-10'
                dangerouslySetInnerHTML={{ __html: materi.iframeYoutube }}
              />
            )}
            {materi?.iframeGoogleSlide && (
              <div
                className='mx-auto'
                dangerouslySetInnerHTML={{ __html: materi.iframeGoogleSlide }}
              />
            )}
            {materi?.pdfUrl && (
              <img src={materi.pdfUrl} alt='Materi PDF' className='mx-auto' />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Summary Siswa */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Ringkasan Siswa</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {materi?.SummaryMateri?.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              Belum ada siswa yang mengumpulkan ringkasan.
            </p>
          )}

          <ScrollArea className='max-h-[300px] pr-2'>
            <div className='grid grid-cols-4 gap-4'>
              {materi?.SummaryMateri.map((s: any) => (
                <Dialog
                  key={s.id}
                  open={openItem?.id === s.id}
                  onOpenChange={(open) => setOpenItem(open ? s : null)}
                >
                  <DialogTrigger asChild>
                    <Card className='cursor-pointer transition hover:bg-muted/50'>
                      <CardHeader className='flex flex-row items-center gap-4'>
                        <Avatar>
                          <AvatarImage src={s.fotoSiswa} />
                          <AvatarFallback>{s.nama?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='text-sm font-semibold'>{s.nama}</div>
                          <div className='text-xs text-muted-foreground'>
                            {s.waktu}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='text-sm text-muted-foreground'>
                          {excerptFromHtml(s?.content, 120)}
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className='max-w-3xl'>
                    <AlertDialogHeader>
                      <DialogTitle>{s.nama}</DialogTitle>
                      <DialogDescription>{s.waktu}</DialogDescription>
                    </AlertDialogHeader>
                    <div className='prose mt-4 max-h-[70vh] overflow-auto'>
                      <div dangerouslySetInnerHTML={{ __html: s?.content }} />
                    </div>

                    {s?.fotoSummary?.length > 0 && (
                      <div className='mt-3 grid grid-cols-2 gap-3'>
                        {s?.fotoSummary.map((foto: any, i: number) => (
                          <Dialog key={i}>
                            <VisuallyHidden>
                              <DialogTitle>Detail</DialogTitle>
                            </VisuallyHidden>
                            <DialogTrigger asChild>
                              <Image
                                src={foto.fotoUrl}
                                alt={`summary-foto-${i}`}
                                width={300}
                                height={300}
                                className='h-32 w-full cursor-pointer rounded-lg object-cover transition hover:opacity-80'
                              />
                            </DialogTrigger>

                            <DialogContent className='max-w-5xl border-none bg-black/95 p-4'>
                              <div className='flex flex-col items-center justify-center'>
                                <Image
                                  src={foto.fotoUrl}
                                  alt={`foto-detail-${i}`}
                                  width={800}
                                  height={800}
                                  className='max-h-[80vh] w-auto rounded-lg object-contain'
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
