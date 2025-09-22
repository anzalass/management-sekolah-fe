'use client';
import React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Unauthorized() {
  const { data: session } = useSession();

  return (
    <div className='flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100'>
      <motion.div
        className='w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Lock className='h-10 w-10 text-red-500' />
        </motion.div>

        <h1 className='mb-2 text-3xl font-bold text-gray-800'>Akses Ditolak</h1>
        <p className='mb-6 text-gray-600'>
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        {session?.user?.jabatan === 'Siswa' ? (
          <Link
            href='/siswa'
            className='inline-block rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-red-600'
          >
            Kembali ke Beranda
          </Link>
        ) : (
          <Link
            href='/mengajar'
            className='inline-block rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-red-600'
          >
            Kembali ke Beranda
          </Link>
        )}
      </motion.div>
    </div>
  );
}
