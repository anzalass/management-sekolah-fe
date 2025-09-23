'use client';
import React, { useEffect, useState } from 'react';
import NavbarSiswa from '../navbar-siswa';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type Props = {
  idUjian: string;
};

type Ujian = {
  id: string;
  nama: string;
  iframe: string;
};

export default function DetailUjianView({ idUjian }: Props) {
  const [ujian, setUjian] = useState<Ujian>();
  const { data: session } = useSession();

  useEffect(() => {
    // Blokir shortcut keyboard (Ctrl+C, Ctrl+X, Ctrl+U, PrintScreen)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C')) || // copy
        (e.ctrlKey && (e.key === 'x' || e.key === 'X')) || // cut
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) || // view source
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getData = async () => {
    try {
      const res = await api.get(`ujian-iframe/${idUjian}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      console.log(res.data);
      setUjian(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getData();
  }, [idUjian, session]);

  return (
    <div className='w-full'>
      <NavbarSiswa title='Ujian Siswa' />
      {ujian ? (
        <div className='relative mx-auto w-full'>
          {/* iframe ujian (bisa diisi normal) */}
          <iframe src={ujian?.iframe} className='h-screen w-full select-none'>
            Memuat…
          </iframe>

          {}

          {/* Overlay transparan untuk blokir klik kanan */}
          <div
            className='absolute inset-0 h-full w-full'
            onContextMenu={(e) => e.preventDefault()} // blokir klik kanan
            style={{ pointerEvents: 'none' }} // supaya overlay nggak ganggu klik kiri
          ></div>
        </div>
      ) : null}
    </div>
  );
}
