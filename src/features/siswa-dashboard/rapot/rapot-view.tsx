'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { CalendarIcon, FileTextIcon, StepBack } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { toast } from 'sonner';

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
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getRapot();
  }, []);

  return (
    <div className='mx-auto mb-14 space-y-6 bg-white'>
      <NavbarSiswa title='Rapot' />

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
      <BottomNav />
    </div>
  );
}
