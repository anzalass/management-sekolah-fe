'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { API } from '@/lib/server';

interface Summary {
  id: number;
  nama: string;
  nisSiswa: string;
  content: any;
  fotoSiswa?: string;
  waktu: string;
}

interface Tugas {
  judul: string;
  konten: any;
  deadline: string;
  iframeGoogleSlide: string;
  iframeYoutube: string;
  pdfUrl: string;
  summary: Summary[];
}

type IDTugas = {
  id: string;
};
export default function TugasView({ id }: IDTugas) {
  const [Tugas, setTugas] = useState<Tugas>();

  const getData = async () => {
    try {
      const response = await axios.get(`${API}tugas-summary/${id}`);
      setTugas(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='space-y-8'>
      {/* Section Tugas */}
      <Card>
        <CardHeader>
          <CardTitle>📘 {Tugas?.judul}</CardTitle>
        </CardHeader>
        <CardContent className='prose max-w-none dark:prose-invert'>
          <div dangerouslySetInnerHTML={{ __html: Tugas?.konten }} />{' '}
        </CardContent>
      </Card>

      {/* Section Summary Siswa */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Ringkasan Siswa</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {Tugas?.summary?.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              Belum ada siswa yang mengumpulkan ringkasan.
            </p>
          )}

          <ScrollArea className='max-h-[300px] pr-2'>
            <div className='space-y-4'>
              {Tugas?.summary?.map((s) => (
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
