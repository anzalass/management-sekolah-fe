'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';

import { Loader2, CalendarDays } from 'lucide-react';
import api from '@/lib/api';
type IDPengumuman = {
  id: string;
};

export default function DetailPengumumanView({ id }: IDPengumuman) {
  const { data: session } = useSession();

  const {
    data: pengumuman,
    isLoading,
    error
  } = useQuery({
    queryKey: ['pengumuman-detail', id],
    queryFn: async () => {
      const res = await api.get(`/pengumuman/get/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    },
    enabled: !!id && !!session?.user?.token
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20 dark:from-[#0f172a] dark:to-[#020617]'>
      <NavbarSiswa title='Detail Pengumuman' />

      <div className='max-w-xlpy-5 mx-auto'>
        {/* 🔄 Loading */}
        {isLoading && (
          <div className='flex items-center justify-center py-20'>
            <Loader2 className='h-6 w-6 animate-spin text-gray-500' />
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div className='py-10 text-center text-red-500'>
            Gagal memuat pengumuman
          </div>
        )}

        {/* ✅ Content */}
        {pengumuman && (
          <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1e293b]'>
            {/* Title */}
            <h1 className='mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100'>
              {pengumuman.title}
            </h1>

            {/* Date */}
            <div className='mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
              <CalendarDays className='h-4 w-4' />
              {new Date(pengumuman.time).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>

            {/* Image */}
            {pengumuman.fotoUrl && (
              <div className='mb-4'>
                <img
                  src={pengumuman.fotoUrl}
                  alt='foto'
                  className='max-h-64 w-full rounded-xl object-cover'
                />
              </div>
            )}

            {/* Content */}
            <div
              className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'
              dangerouslySetInnerHTML={{ __html: pengumuman.content }}
            />

            {/* Badge tipe */}
            <div className='mt-4'>
              <span
                className={`rounded-full px-2 py-1 text-[10px] ${
                  pengumuman.type === 'kelas'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                }`}
              >
                {pengumuman.type === 'kelas'
                  ? 'Pengumuman Kelas'
                  : 'Pengumuman Umum'}
              </span>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
