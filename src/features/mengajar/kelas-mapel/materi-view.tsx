'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { API } from '@/lib/server';
import { toast } from 'sonner';

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
  summary: Summary[];
}

type IDMateri = {
  id: string;
};
export default function MateriView({ id }: IDMateri) {
  const [materi, setMateri] = useState<Materi>();

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}materi-summary/${id}`
      );
      setMateri(response.data.data);
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='space-y-8'>
      {/* Section Materi */}
      <Card>
        <CardHeader>
          <CardTitle>📘 {materi?.judul}</CardTitle>
        </CardHeader>
        <CardContent className='prose max-w-none dark:prose-invert'>
          <div dangerouslySetInnerHTML={{ __html: materi?.konten }} />{' '}
          <div className='mx-auto w-full items-center justify-center'>
            <div
              className='mx-auto mb-10'
              dangerouslySetInnerHTML={{ __html: materi?.iframeYoutube }}
            />{' '}
            <div
              className='mx-auto'
              dangerouslySetInnerHTML={{ __html: materi?.iframeGoogleSlide }}
            />{' '}
          </div>
        </CardContent>
      </Card>

      {/* Section Summary Siswa */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Ringkasan Siswa</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {materi?.summary?.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              Belum ada siswa yang mengumpulkan ringkasan.
            </p>
          )}

          <ScrollArea className='max-h-[300px] pr-2'>
            <div className='space-y-4'>
              {materi?.summary?.map((s) => (
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
                    <p className='text-sm text-muted-foreground'>{s.content}</p>
                    <p className='text-xs text-muted-foreground'>{s.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
