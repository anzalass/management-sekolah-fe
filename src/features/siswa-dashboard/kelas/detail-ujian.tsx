'use client';
import React, { useEffect } from 'react';
import NavbarSiswa from '../navbar-siswa';

export default function DetailUjianView() {
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

  return (
    <div className='w-full'>
      <NavbarSiswa title='Ujian Siswa' />
      <div className='relative mx-auto w-full'>
        {/* iframe ujian (bisa diisi normal) */}
        <iframe
          src='https://docs.google.com/forms/d/e/1FAIpQLSdyU1ByUt4EjH5X_qmZe36CMnEwnPUdaNTlOhmhcSBlJCCPAA/viewform?usp=sf_link'
          className='h-screen w-full select-none'
        >
          Memuat…
        </iframe>

        {/* Overlay transparan untuk blokir klik kanan */}
        <div
          className='absolute inset-0 h-full w-full'
          onContextMenu={(e) => e.preventDefault()} // blokir klik kanan
          style={{ pointerEvents: 'none' }} // supaya overlay nggak ganggu klik kiri
        ></div>
      </div>
    </div>
  );
}
