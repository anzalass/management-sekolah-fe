'use client';

import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  StepBack,
  Menu,
  ChevronLeft,
  BookOpen,
  Check,
  Sparkles,
  FileText,
  Youtube,
  Save,
  Clock,
  X,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import TextEditor from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FotoSummary {
  id: string;
  fotoUrl: string;
}

interface SummarySiswa {
  id: string;
  nama: string;
  idSiswa: string;
  content: string;
  fotoSiswa?: string;
  waktu: string;
  FotoSummaryMateri?: FotoSummary[];
}

interface MateriItem {
  id: string;
  judul: string;
  konten: string;
  iframeGoogleSlide?: string;
  idKelasMapel: string;
  nama: string;
  iframeYoutube?: string;
  pdfUrl?: string;
  past?: boolean;
}

interface MateriResponse {
  materi: MateriItem;
  mama: string;
  summarySiswa: SummarySiswa | null;
}

type IDMateri = {
  idMateri: string;
  idKelas: string;
};

interface ListMateriItem {
  id: string;
  judul: string;
  past?: boolean;
}

export default function DetailMateriView({ idMateri, idKelas }: IDMateri) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { konten: '' }
  });

  const {
    data: materi,
    isLoading,
    error
  } = useQuery<MateriResponse>({
    queryKey: ['materi', idMateri],
    queryFn: async () => {
      const res = await api.get(`materi-summary-siswa/${idMateri}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  console.log(materi);

  const { data: listMateri } = useQuery<ListMateriItem[]>({
    queryKey: ['listMateri', idKelas],
    queryFn: async () => {
      const res = await api.get(`kelas-mapel/${idKelas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data.MateriMapel || [];
    },
    enabled: !!session?.user?.token
  });

  // ✅ Tambah loading state otomatis dari React Query
  const addSummaryMutation = useMutation({
    mutationFn: async (data: { konten: string; photos: File[] }) => {
      const fd = new FormData();
      fd.append('idSiswa', session?.user?.idGuru ?? '');
      fd.append('idMateri', idMateri ?? '');
      fd.append('idKelasMapel', idKelas ?? '');
      fd.append('content', data.konten);
      fd.append('waktu', new Date().toISOString());

      data.photos.forEach((file) => {
        fd.append('foto', file);
      });

      await api.post('summary', fd, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    },

    onSuccess: () => {
      toast.success('Ringkasan berhasil disimpan');
      reset();
      setSelectedPhotos([]);
      queryClient.invalidateQueries({ queryKey: ['materi', idMateri] });
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan ringkasan');
    }
  });

  const onSubmit = (data: { konten: string }) => {
    addSummaryMutation.mutate({
      konten: data.konten,
      photos: selectedPhotos
    });
  };
  const firstInitial = session?.user?.nama?.split(' ')[0]?.[0] || '';
  const secondInitial = session?.user?.nama?.split(' ')[1]?.[0] || '';
  if (isLoading) return <p className='p-4 text-center'>Loading...</p>;
  if (error)
    return <p className='p-4 text-center text-red-500'>Error loading materi</p>;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
      {/* Header */}
      <div className='mx-auto flex w-full items-center justify-between bg-blue-800 p-5'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => window.history.back()}
            className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30'
          >
            <ChevronLeft className='h-6 w-6 text-white' />
          </button>
          <div>
            <h1 className='text-lg font-bold text-white'>
              {materi?.mama} - {materi?.materi?.judul}
            </h1>
          </div>
        </div>

        {/* ✅ Tambah tombol menu khusus mobile */}
        <Link
          href={`/siswa/kelas/${materi?.materi?.idKelasMapel}`}
          className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30 lg:hidden'
        >
          <Menu className='h-6 w-6 text-white' />
        </Link>

        <div className='hidden h-10 w-10 overflow-hidden rounded-full border-2 border-white lg:block'>
          <Image
            src={
              session?.user?.foto
                ? session?.user?.foto
                : `https://ui-avatars.com/api/?name=${firstInitial}+${secondInitial}&background=random&format=png`
            }
            alt='Foto User'
            width={40}
            height={40}
          />
        </div>
      </div>

      {/* Sidebar Mobile */}
      {showSidebar && (
        <div className='fixed inset-0 z-50 flex'>
          {/* Overlay */}
          <div
            onClick={() => setShowSidebar(false)}
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
          />

          {/* Panel Sidebar */}
          <div className='relative z-10 h-full w-3/4 max-w-xs bg-white p-4 shadow-xl'>
            <div className='mb-4 flex items-center justify-between border-b border-gray-200 pb-3'>
              <h2 className='flex items-center gap-2 font-bold text-gray-900'>
                <BookOpen className='h-5 w-5 text-blue-600' /> Daftar Materi
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                className='rounded-full p-1 hover:bg-gray-100'
              >
                <X className='h-5 w-5 text-gray-600' />
              </button>
            </div>

            <div className='space-y-2 overflow-y-auto'>
              {listMateri?.map((m) => (
                <Link
                  key={m.id}
                  href={`/siswa/kelas/${idKelas}/materi/${m.id}`}
                  onClick={() => setShowSidebar(false)} // ✅ Tutup sidebar saat klik
                >
                  <button
                    className={`w-full rounded-xl px-3 py-3 text-left transition-all ${
                      m.id === idMateri
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='flex-1 text-sm font-medium'>
                        {m.judul}
                      </span>
                      {m.past && (
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${
                            m.id === idMateri ? 'bg-white/20' : 'bg-green-100'
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 ${
                              m.id === idMateri
                                ? 'text-white'
                                : 'text-green-600'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className='mx-auto w-full px-4 py-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          {/* Sidebar kiri */}
          <div className='hidden lg:col-span-3 lg:block'>
            <div className='sticky top-0 rounded-2xl bg-white p-4 shadow-lg'>
              <div className='mb-4 flex items-center gap-2 border-b border-gray-200 pb-3'>
                <BookOpen className='h-5 w-5 text-blue-600' />
                <h2 className='font-bold text-gray-900'>Daftar Materi</h2>
              </div>
              <div className='max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto'>
                {listMateri?.map((m) => (
                  <Link
                    key={m.id}
                    href={`/siswa/kelas/${idKelas}/materi/${m.id}`}
                  >
                    <button
                      className={`w-full rounded-xl px-3 py-3 text-left transition-all ${
                        m.id === idMateri
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className='flex items-center justify-between gap-2'>
                        <span className='flex-1 text-sm font-medium'>
                          {m.judul}
                        </span>
                        {m.past && (
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full ${
                              m.id === idMateri ? 'bg-white/20' : 'bg-green-100'
                            }`}
                          >
                            <Check
                              className={`h-3 w-3 ${
                                m.id === idMateri
                                  ? 'text-white'
                                  : 'text-green-600'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Konten utama */}
          <div className='lg:col-span-6'>
            <div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
              <div className='border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4'>
                <h2 className='flex items-center gap-2 text-xl font-bold text-gray-900'>
                  <FileText className='h-6 w-6 text-blue-600' />
                  {materi?.materi?.judul}
                </h2>
              </div>
              <div className='p-6'>
                <div
                  className='prose prose-sm mb-6 max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: materi?.materi?.konten || ''
                  }}
                />
                {materi?.materi?.iframeYoutube && (
                  <div className='aspect-video overflow-hidden rounded-xl shadow-lg'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: materi?.materi?.iframeYoutube
                      }}
                      className='h-full w-full'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className='lg:col-span-3'>
            <div className='sticky top-0 rounded-2xl bg-white p-4 shadow-lg'>
              <div className='mb-4 flex items-center gap-2 border-b border-gray-200 pb-3'>
                <Sparkles className='h-5 w-5 text-yellow-600' />
                <h2 className='font-bold text-gray-900'>Ringkasan Saya</h2>
              </div>

              {materi?.summarySiswa === null && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='space-y-4'
                  encType='multipart/form-data'
                >
                  <Controller
                    name='konten'
                    control={control}
                    render={({ field }) => (
                      <TextEditor
                        type='materi'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedPhotos(Array.from(e.target.files));
                      }
                    }}
                    className='mt-1 w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-600 hover:file:bg-blue-100'
                  />

                  {selectedPhotos.length > 0 && (
                    <div className='mt-3 grid grid-cols-3 gap-2'>
                      {selectedPhotos.map((photo, idx) => (
                        <div key={idx} className='relative'>
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`preview-${idx}`}
                            className='h-24 w-full rounded-lg object-cover shadow-sm'
                          />
                          <button
                            type='button'
                            onClick={() =>
                              setSelectedPhotos((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className='absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70'
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type='submit'
                    className='w-full'
                    disabled={addSummaryMutation.isPending}
                  >
                    {addSummaryMutation.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Ringkasan'
                    )}
                  </Button>
                </form>
              )}

              <div className='mt-4 max-h-[400px] space-y-3 overflow-y-auto'>
                {!materi?.summarySiswa ? (
                  <p className='text-sm text-gray-500'>Belum ada ringkasan.</p>
                ) : (
                  <div
                    key={materi.summarySiswa.id}
                    className='rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4'
                  >
                    <div className='mb-3 flex items-start gap-3'>
                      <Image
                        src={
                          session?.user?.foto
                            ? session?.user?.foto
                            : `https://ui-avatars.com/api/?name=${firstInitial}+${secondInitial}&background=random&format=png`
                        }
                        alt='Foto User'
                        width={40}
                        height={40}
                        className='rounded-full'
                      />
                      <div>
                        <p className='text-sm font-semibold text-gray-900'>
                          {materi.summarySiswa.nama}
                        </p>
                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                          <Clock className='h-3 w-3' />
                          <span>
                            {new Date(
                              materi.summarySiswa.waktu
                            ).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className='prose prose-sm max-w-none text-gray-700'
                      dangerouslySetInnerHTML={{
                        __html: materi.summarySiswa.content
                      }}
                    />

                    {(materi?.summarySiswa?.FotoSummaryMateri?.length ?? 0) >
                      0 && (
                      <div className='mt-3 grid grid-cols-2 gap-3'>
                        {(materi?.summarySiswa?.FotoSummaryMateri ?? []).map(
                          (foto, i) => (
                            <Image
                              key={i}
                              src={foto.fotoUrl}
                              alt='summary-foto'
                              width={300}
                              height={300}
                              className='h-32 w-full rounded-lg object-cover'
                            />
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
