'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 state pencarian

  // 🔹 React Query untuk fetch materi
  const {
    data: materi,
    isLoading,
    isError
  } = useQuery<Materi>({
    queryKey: ['materi-summary', id],
    queryFn: async () => {
      const response = await api.get(`materi-summary/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return response.data.data;
    },
    enabled: !!session?.user?.token
  });

  if (isLoading)
    return (
      <p className='text-center text-sm text-muted-foreground'>Loading...</p>
    );

  if (isError || !materi)
    return (
      <p className='text-center text-sm text-red-500'>
        Gagal memuat data materi
      </p>
    );

  // 🔍 Filter berdasarkan nama siswa
  const filteredSummaries = materi.SummaryMateri.filter((s) =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Card className='w-[92vw] overflow-x-auto md:w-[84vw]'>
        <CardHeader className='flex flex-col md:flex-row md:items-center md:justify-between'>
          <CardTitle className='text-base md:text-lg'>
            📋 Ringkasan Siswa
          </CardTitle>

          {/* 🔍 Input Search */}
          <Input
            placeholder='Cari nama siswa...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='mt-2 w-full md:mt-0 md:w-64'
          />
        </CardHeader>

        <CardContent className='w-full'>
          {filteredSummaries.length === 0 ? (
            <p className='text-center text-sm text-muted-foreground'>
              {searchTerm
                ? 'Tidak ada siswa dengan nama tersebut.'
                : 'Belum ada siswa yang mengumpulkan ringkasan.'}
            </p>
          ) : (
            <Table className='w-[200vw] md:w-full'>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Ringkasan</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummaries.map((s: any, index) => (
                  <TableRow key={s.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={s.fotoSiswa} />
                        <AvatarFallback>{s.nama?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className='max-w-[120px] truncate'>{s.nama}</span>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(s.waktu),
                        "dd MMMM yyyy, HH:mm 'WIB'",
                        {}
                      )}
                    </TableCell>
                    <TableCell className='max-w-[250px] truncate text-sm text-muted-foreground'>
                      {excerptFromHtml(s?.content, 100)}
                    </TableCell>
                    <TableCell>
                      {s?.fotoSummary?.length > 0 ? (
                        <Badge variant='secondary'>
                          {s.fotoSummary.length} Foto
                        </Badge>
                      ) : (
                        <Badge variant='outline'>Tidak Ada</Badge>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Dialog
                        open={openItem?.id === s.id}
                        onOpenChange={(open) => setOpenItem(open ? s : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant='outline' size='sm'>
                            Lihat Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-3xl'>
                          <DialogHeader>
                            <DialogTitle>{s.nama}</DialogTitle>
                            <DialogDescription>
                              {format(
                                new Date(s?.waktu),
                                "dd MMMM yyyy, HH:mm 'WIB'",
                                {}
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <div className='prose mt-4 max-h-[70vh] overflow-auto'>
                            <div
                              dangerouslySetInnerHTML={{ __html: s?.content }}
                            />
                          </div>

                          {s?.fotoSummary?.length > 0 && (
                            <div className='mt-4 grid grid-cols-2 gap-3'>
                              {s.fotoSummary.map((foto: any, i: any) => (
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
