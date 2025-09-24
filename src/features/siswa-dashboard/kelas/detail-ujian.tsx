'use client';
import React, { useEffect, useState } from 'react';
import NavbarSiswa from '../navbar-siswa';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // pastikan ada button shadcn

type Props = {
  idUjian: string;
  idKelasMapel: string;
};

type Ujian = {
  id: string;
  nama: string;
  iframe: string;
};

export default function DetailUjianView({ idUjian, idKelasMapel }: Props) {
  const [ujian, setUjian] = useState<Ujian>();
  const [status, setStatus] = useState<string>('');
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
      setUjian(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleFinishExam = async () => {
    try {
      const res = await api.post(`ujian-iframe-selesai`, {
        idSiswa: session?.user?.idGuru,
        idKelasMapel: idKelasMapel,
        idUjianIframe: idUjian
      });
      if (res.status === 200) {
        window.location.href = '/siswa';
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getStatusUjian = async () => {
    try {
      const res = await api.post(`get-ujian-iframe-selesai`, {
        idSiswa: session?.user?.idGuru,
        idKelasMapel: idKelasMapel,
        idUjianIframe: idUjian
      });

      if (res.status === 200) {
        console.log('stts', res.data);
        setStatus(res.data.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getStatusUjian();
  }, []);

  useEffect(() => {
    getData();
  }, [idUjian, session, idKelasMapel, status === 'Belum Selesai']);

  if (status === 'Selesai') {
    return null;
  }

  return (
    <div className='relative w-full'>
      {/* <NavbarSiswa title='Ujian Siswa' /> */}
      {/* pesan fixed di atas */}
      <p className='sticky top-0 z-50 bg-red-300 p-2 text-center text-red-800'>
        Siswa Harap Klik Tombol Selesaikan Ujian Setelah Mengirim Semua Jawaban
        Agar Jawaban Tercatat
      </p>

      {ujian ? (
        <div className='relative mx-auto w-full'>
          {/* iframe ujian */}
          <iframe src={ujian?.iframe} className='h-screen w-full select-none'>
            Memuat…
          </iframe>

          {/* Overlay transparan untuk blokir klik kanan */}
          <div
            className='absolute inset-0 h-full w-full'
            onContextMenu={(e) => e.preventDefault()} // blokir klik kanan
            style={{ pointerEvents: 'none' }} // supaya overlay nggak ganggu klik kiri
          ></div>

          {/* Tombol selesaikan ujian fixed di bawah */}
          <div className='fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-white/90 p-4 shadow-md'>
            <Button variant='destructive' size='lg' onClick={handleFinishExam}>
              Selesaikan Ujian
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
