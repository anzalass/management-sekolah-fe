'use client';
import React, { useEffect, useState, useRef } from 'react';
import NavbarSiswa from '../navbar-siswa';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  const submittedRef = useRef(false);
  const leaveThresholdMs = 2000; // toleransi 2 detik

  // === Blokir keyboard & klik kanan ===
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ['c', 'x', 'u', 'C', 'X', 'U'].includes(e.key)) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        toast.warning('Aksi ini tidak diperbolehkan selama ujian!');
        return false;
      }
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // === Ambil data ujian ===
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

  useEffect(() => {
    let resizeTimer: number | null = null;
    const originalHeight = window.innerHeight;

    const detectResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const diff = Math.abs(window.innerHeight - originalHeight);
        // kalau tinggi layar turun drastis > 150px, kemungkinan split screen
        if (diff > 150 && !submittedRef.current) {
          toast.warning('Terdeteksi mode split screen!');
          handleFinishExam('split-screen');
        }
      }, 800);
    };

    window.addEventListener('resize', detectResize);
    return () => window.removeEventListener('resize', detectResize);
  }, []);

  // === Kirim ujian selesai ===
  const handleFinishExam = async (reason?: string) => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const payload = {
      idSiswa: session?.user?.idGuru, // FIXED
      idKelasMapel,
      idUjianIframe: idUjian,
      reason: reason || 'manual',
      token: session?.user?.token
    };

    try {
      if (navigator.sendBeacon) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}ujian-iframe-selesai`;
        const blob = new Blob([JSON.stringify(payload)], {
          type: 'application/json'
        });
        navigator.sendBeacon(url, blob);
      } else {
        await api.post('ujian-iframe-selesai', payload, {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        });
      }
      toast.success('Ujian telah diselesaikan!');
      setTimeout(() => (window.location.href = '/siswa'), 800);
    } catch (error: any) {
      toast.error('Gagal menyelesaikan ujian!');
    }
  };

  // === Cek status ujian ===
  const getStatusUjian = async () => {
    try {
      const res = await api.post(
        `get-ujian-iframe-selesai`,
        {
          idSiswa: session?.user?.idGuru,
          idKelasMapel,
          idUjianIframe: idUjian
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      if (res.status === 200) setStatus(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  // === AUTO SUBMIT KALAU CURANG ===
  useEffect(() => {
    if (!idUjian || !session?.user?.token) return;
    let leaveTimer: number | null = null;

    const forceSubmitExam = (reason: string) => {
      if (!submittedRef.current) {
        toast.warning('Sesi ujian berakhir karena aktivitas mencurigakan!');
        handleFinishExam(reason);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        leaveTimer = window.setTimeout(
          () => forceSubmitExam('tab-hidden'),
          leaveThresholdMs
        );
      } else if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
    };

    const handlePageHide = () => forceSubmitExam('pagehide');
    const handleBeforeUnload = () => forceSubmitExam('beforeunload');
    const handleBlur = () => {
      leaveTimer = window.setTimeout(
        () => forceSubmitExam('blur'),
        leaveThresholdMs
      );
    };
    const handleFocus = () => {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
    };
    const handleOffline = () => {
      toast.error('Koneksi terputus, ujian otomatis diselesaikan!');
      forceSubmitExam('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);
    // window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('offline', handleOffline);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [idUjian, idKelasMapel, session?.user?.token]);

  // === Load Data ===
  useEffect(() => {
    getStatusUjian();
  }, []);

  useEffect(() => {
    getData();
  }, [idUjian, session, idKelasMapel, status === 'Belum Selesai']);

  if (status === 'Selesai')
    return (
      <p>
        ga ada
        <Link href={'/siswa'}>kembali</Link>
      </p>
    );

  console.log(status);

  return (
    <div className='relative min-h-screen w-full'>
      {/* Peringatan */}
      <p className='sticky top-0 z-50 bg-red-300 p-2 text-center text-red-800'>
        ⚠️ Siswa harap klik tombol <strong>Selesaikan Ujian</strong> setelah
        mengirim semua jawaban.
      </p>

      {/* === iframe ujian === */}
      {ujian?.iframe && (
        <iframe
          src={
            ujian.iframe.includes('embedded=true')
              ? ujian.iframe
              : ujian.iframe.replace(/\?.*/, '?embedded=true')
          }
          className='h-screen w-full select-none border-0'
          sandbox='allow-forms allow-scripts allow-same-origin allow-popups allow-presentation'
          allow='fullscreen; clipboard-read; clipboard-write; autoplay; encrypted-media'
          referrerPolicy='no-referrer'
          loading='lazy'
          title='Ujian Siswa'
        >
          Memuat…
        </iframe>
      )}

      {/* Tombol selesaikan ujian */}
      <div className='fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-white/90 p-4 shadow-md'>
        <Button
          variant='destructive'
          size='lg'
          onClick={() => handleFinishExam('manual')}
        >
          Selesaikan Ujian
        </Button>
      </div>
    </div>
  );
}
