'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Summary {
  id: number;
  siswa: string;
  ringkasan: string;
  avatarUrl?: string;
  waktu: string;
}

const markdownContent = `
# Pengantar Pemrograman
Materi ini membahas dasar-dasar pemrograman komputer, termasuk sintaks dasar, logika, dan struktur kontrol.

## Tujuan Pembelajaran
- Memahami struktur dasar program
- Menulis kode sederhana
- Menyusun logika pemecahan masalah

## Contoh Kode
\`\`\`javascript
function haloDunia() {
  console.log("Halo, dunia!");
}
haloDunia();
\`\`\`
`;

type IDMateri = {
  id: string;
};
export default function MateriView({ id }: IDMateri) {
  const [summaryList, setSummaryList] = useState<Summary[]>([]);

  useEffect(() => {
    // Simulasi data siswa yang sudah mengumpulkan ringkasan
    const dummy: Summary[] = [
      {
        id: 1,
        siswa: 'Ali',
        ringkasan:
          'Saya belajar tentang fungsi dan logika dasar dalam JavaScript.',
        waktu: '2025-06-18 10:20',
        avatarUrl: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: 2,
        siswa: 'Budi',
        ringkasan:
          'Materi ini menjelaskan cara membuat program sederhana dan mencetak ke console.',
        waktu: '2025-06-18 10:40',
        avatarUrl: 'https://i.pravatar.cc/150?img=2'
      },
      {
        id: 3,
        siswa: 'Citra',
        ringkasan:
          'Saya paham bagaimana menulis fungsi dan menampilkannya di console.',
        waktu: '2025-06-18 11:00',
        avatarUrl: 'https://i.pravatar.cc/150?img=3'
      }
    ];
    setSummaryList(dummy);
  }, []);

  return (
    <div className='space-y-8'>
      {/* Section Materi */}
      <Card>
        <CardHeader>
          <CardTitle>📘 Materi: Pengantar Pemrograman</CardTitle>
        </CardHeader>
        <CardContent className='prose dark:prose-invert max-w-none'>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </CardContent>
      </Card>

      {/* Section Summary Siswa */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Ringkasan Siswa</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {summaryList.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              Belum ada siswa yang mengumpulkan ringkasan.
            </p>
          )}

          <ScrollArea className='max-h-[300px] pr-2'>
            <div className='space-y-4'>
              {summaryList.map((s) => (
                <div
                  key={s.id}
                  className='flex gap-4 rounded-md border p-3 shadow-sm transition hover:bg-muted/50'
                >
                  <Avatar>
                    <AvatarImage src={s.avatarUrl} />
                    <AvatarFallback>{s.siswa.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <div className='text-sm font-semibold'>{s.siswa}</div>
                    <p className='text-sm text-muted-foreground'>
                      {s.ringkasan}
                    </p>
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
