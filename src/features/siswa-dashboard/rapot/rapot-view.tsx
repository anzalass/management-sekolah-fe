'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { CalendarIcon, FileTextIcon, StepBack } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RapotView() {
  const { data: session } = useSession();
  const [rapot, setRapot] = useState<any[]>([]);

  const getRapot = async () => {
    try {
      const res = await api.get('siswa/rapot', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setRapot(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRapot();
  }, []);

  return (
    <div className='mx-auto space-y-6'>
      <div className='relative flex h-[10vh] w-full items-center justify-between rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        {/* Tombol Back */}
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-1 text-white hover:opacity-80'
        >
          <StepBack />
        </button>

        {/* Title */}
        <h1 className='text-lg font-semibold'>Rapot</h1>

        {/* Foto Profil User */}
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

      <div className='space-y-4 p-4'>
        {rapot?.map((rapot) => (
          <Card
            key={rapot.id}
            className='flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center'
          >
            <div className='space-y-1'>
              <CardTitle className='text-base font-semibold'>
                {rapot.namaKelas} - Tahun Ajaran {rapot.tahunAjaran}
              </CardTitle>
              <p>{rapot.namaGuru}</p>
              <p className='flex items-center text-sm text-muted-foreground'>
                <CalendarIcon className='mr-1 h-4 w-4' />
                {rapot.rapotSiswa}
              </p>
            </div>

            <div>
              {rapot.rapotSiswa === 'Terbit' ? (
                <Link href={`/siswa/rapot/${rapot.idKelas}`}>
                  <button className='flex items-center gap-1 text-sm font-medium text-primary hover:underline'>
                    <FileTextIcon className='h-4 w-4' />
                    Lihat Rapot
                  </button>
                </Link>
              ) : (
                <span className='text-sm italic text-red-500'>
                  Belum tersedia
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
