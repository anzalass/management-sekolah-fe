'use client';

import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import TextEditor from '@/components/text-editor';
import BottomNav from '../bottom-nav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  BookOpen,
  Check,
  ChevronLeft,
  Clock,
  FileText,
  Loader2,
  Menu,
  Sparkles,
  StepBack,
  X,
  Youtube
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface FotoSummaryTugas {
  id: string;
  fotoUrl: string;
  fotoId?: string;
}

interface SummaryTugas {
  id: string;
  nama: string;
  idSiswa: string;
  content: string;
  fotoSiswa?: string;
  waktu: string;
  FotoSummaryTugas?: FotoSummaryTugas[];
}

interface TugasDetail {
  nama: string;
  tugas: {
    id: string;
    judul: string;
    konten: string;
    idKelasMapel: string;
    iframeGoogleSlide?: string;
    iframeYoutube?: string;
    pdfUrl?: string;
  };
  summarySiswa: SummaryTugas | null;
}

interface TugasListItem {
  id: string;
  judul: string;
  konten: string;
  iframeGoogleSlide?: string;
  iframeYoutube?: string;
  pdfUrl?: string;
  past: boolean;
}

type IDTugas = {
  idTugas: string;
  idKelasMapel: string;
};

export default function DetailTugasView({ idTugas, idKelasMapel }: IDTugas) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [activeMateri, setActiveMateri] = useState('1');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { konten: '' }
  });

  // Query ambil detail tugas
  const { data: tugas, isLoading: loadingTugas } = useQuery<TugasDetail>({
    queryKey: ['tugas', idTugas],
    queryFn: async () => {
      const res = await api.get(`tugas-summary-siswa/${idTugas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  const { data: listTugas, isLoading: loadingList } = useQuery<TugasListItem[]>(
    {
      queryKey: ['kelas', idKelasMapel],
      queryFn: async () => {
        const res = await api.get(`kelas-mapel/${idKelasMapel}`, {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        });
        return res.data.data.TugasMapel || [];
      },
      enabled: !!session?.user?.token
    }
  );

  // Mutation submit ringkasan
  const addSummaryMutation = useMutation({
    mutationFn: async (data: { konten: string; photos: File[] }) => {
      const fd = new FormData();
      fd.append('idSiswa', session?.user?.idGuru ?? '');
      fd.append('idTugas', idTugas ?? '');
      fd.append('idKelasMapel', idKelasMapel ?? '');
      fd.append('content', data.konten);
      fd.append('waktu', new Date().toISOString());

      // Tambahkan semua foto
      data.photos.forEach((file) => {
        fd.append('foto', file); // pastikan backend handle field 'photos'
      });

      await api.post('summary-tugas', fd, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      toast.success('Ringkasan berhasil disimpan');
      reset();
      setSelectedPhotos([]); // clear preview
      queryClient.invalidateQueries({ queryKey: ['tugas', idTugas] });
      queryClient.invalidateQueries({ queryKey: ['kelas', idKelasMapel] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menyimpan ringkasan');
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
  // Filter summary hanya milik user login

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
      {/* Header */}
      <div
        className={`mx-auto flex w-full items-center justify-between ${process.env.NEXT_PUBLIC_THEME_COLOR} p-5`}
      >
        <div className='flex items-center gap-3'>
          <Link
            href={`/siswa/kelas/${tugas?.tugas?.idKelasMapel}`}
            className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30'
          >
            <ChevronLeft className='h-6 w-6 text-white' />
          </Link>
          <div>
            <h1 className='text-lg font-bold text-white'>
              {tugas?.nama} - {tugas?.tugas?.judul}
            </h1>
          </div>
        </div>

        {/* ✅ Tambah tombol menu khusus mobile */}
        <button
          onClick={() => setShowSidebar(true)}
          className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors active:bg-white/30 lg:hidden'
        >
          <Menu className='h-6 w-6 text-white' />
        </button>

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

      <div className='mx-auto w-full px-4 py-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          {/* Sidebar Desktop */}
          <div className='hidden lg:col-span-3 lg:block'>
            <div className='sticky top-0 rounded-2xl bg-white p-4 shadow-lg'>
              <div className='mb-4 flex items-center gap-2 border-b border-gray-200 pb-3'>
                <BookOpen className='h-5 w-5 text-blue-600' />
                <h2 className='font-bold text-gray-900'>Daftar Materi</h2>
              </div>
              <div className='max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto'>
                {listTugas?.map((m) => (
                  <Link
                    key={m.id}
                    href={`/siswa/kelas/${idKelasMapel}/tugas/${m.id}`}
                  >
                    <button
                      key={m.id}
                      onClick={() => setActiveMateri(m.id)}
                      className={`w-full rounded-xl px-3 py-3 text-left transition-all ${
                        m.id === activeMateri
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
                              m.id === activeMateri
                                ? 'bg-white/20'
                                : 'bg-green-100'
                            }`}
                          >
                            <Check
                              className={`h-3 w-3 ${m.id === activeMateri ? 'text-white' : 'text-green-600'}`}
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

          {/* Sidebar Mobile */}
          {showSidebar && (
            <div className='fixed inset-0 z-50 animate-[fadeIn_0.2s_ease-out] lg:hidden'>
              <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={() => setShowSidebar(false)}
              ></div>
              <div className='absolute bottom-0 left-0 top-0 w-80 max-w-[85vw] animate-[slideRight_0.3s_ease-out] bg-white shadow-2xl'>
                <div className='flex items-center justify-between border-b border-gray-200 p-4'>
                  <h2 className='flex items-center gap-2 font-bold text-gray-900'>
                    <BookOpen className='h-5 w-5 text-blue-600' />
                    Daftar Tugas
                  </h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200'
                  >
                    <X className='h-5 w-5 text-gray-600' />
                  </button>
                </div>
                <div className='h-[calc(100vh-80px)] space-y-2 overflow-y-auto p-4'>
                  {listTugas?.map((m) => (
                    <Link
                      key={m.id}
                      href={`/siswa/kelas/${idKelasMapel}/tugas/${m.id}`}
                    >
                      <button
                        key={m.id}
                        className={`w-full rounded-xl px-3 py-3 text-left transition-all ${
                          m.id === activeMateri
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 active:bg-gray-100'
                        }`}
                      >
                        <div className='flex items-center justify-between gap-2'>
                          <span className='flex-1 text-sm font-medium'>
                            {m.judul}
                          </span>
                          {m.past && (
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                                m.id === activeMateri
                                  ? 'bg-white/20'
                                  : 'bg-green-100'
                              }`}
                            >
                              <Check
                                className={`h-3 w-3 ${m.id === activeMateri ? 'text-white' : 'text-green-600'}`}
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

          {/* Main Content */}
          <div className='lg:col-span-6'>
            <div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
              <div className='border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4'>
                <h2 className='flex items-center gap-2 text-xl font-bold text-gray-900'>
                  <FileText className='h-6 w-6 text-blue-600' />
                  {tugas?.tugas?.judul}
                </h2>
              </div>
              <div className='p-6'>
                {/* Content */}
                <div
                  className='prose prose-sm mb-6 max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: tugas?.tugas?.konten || ''
                  }}
                />

                {/* Video */}
                {tugas?.tugas?.iframeYoutube && (
                  <div className='mb-6'>
                    <div className='mb-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Youtube className='h-5 w-5 text-red-600' />
                        <h3 className='font-bold text-gray-900'>
                          Video Pembelajaran
                        </h3>
                      </div>
                      <p className='text-sm text-gray-600'>
                        Tonton video untuk pemahaman lebih baik
                      </p>
                    </div>
                    <div className='aspect-video overflow-hidden rounded-xl shadow-lg'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: tugas?.tugas?.iframeYoutube
                        }}
                        className='h-full w-full'
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='lg:col-span-3'>
            <div className='sticky top-0 rounded-2xl bg-white p-4 shadow-lg'>
              <div className='mb-4 flex items-center gap-2 border-b border-gray-200 pb-3'>
                <Sparkles className='h-5 w-5 text-yellow-600' />
                <h2 className='font-bold text-gray-900'>Ringkasan Saya</h2>
              </div>

              {tugas?.summarySiswa === null && (
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
                {!tugas?.summarySiswa ? (
                  <p className='text-sm text-gray-500'>Belum ada ringkasan.</p>
                ) : (
                  <div
                    key={tugas?.summarySiswa.id}
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
                          {tugas?.summarySiswa.nama}
                        </p>
                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                          <Clock className='h-3 w-3' />
                          <span>
                            {new Date(
                              tugas?.summarySiswa.waktu
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
                        __html: tugas?.summarySiswa.content
                      }}
                    />

                    {(tugas?.summarySiswa?.FotoSummaryTugas?.length ?? 0) >
                      0 && (
                      <div className='mt-3 grid grid-cols-2 gap-3'>
                        {(tugas?.summarySiswa?.FotoSummaryTugas ?? []).map(
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

          {/* Summary Sidebar */}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .prose h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #374151;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #4b5563;
        }
        .prose ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .prose li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        .prose strong {
          font-weight: 600;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
}
