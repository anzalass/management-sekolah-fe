'use client';
import { format } from 'date-fns';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GoogleGenAI } from '@google/genai';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MarkdownPreview from './md-preview';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface Summary {
  id: number;
  nama: string;
  nisSiswa: string;
  idSiswa: string;
  content: any;
  fotoSiswa?: string;
  waktu: string;
}

interface Materi {
  judul: string;
  konten: any;
  iframeGoogleSlide: any;
  iframeYoutube: any;
  pdfUrl: string;
  SummaryTugas: Summary[];
}

type IDMateri = {
  id: string;
  idKelas: string;
};

type JenisNilaiForm = {
  jenis: string;
  bobot: number;
};

function stripHtml(html = '') {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/** potong jadi preview */
function excerptFromHtml(html = '', maxLen = 120) {
  const text = stripHtml(html).trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '...';
}

interface FormValues {
  idJenisNilai: string;
  idSiswa: string;
  nilai: number;
}

export default function TugasView({ id, idKelas }: IDMateri) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [openItem, setOpenItem] = useState<Summary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jawaban, setJawaban] = useState<any>('');
  const [loadingKoreksi, setLoadingKoreksi] = useState(false);
  const [defaultJenisNilai, setDefaultJenisNilai] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      idJenisNilai: '',
      idSiswa: '',
      nilai: 0
    }
  });

  useEffect(() => {
    if (openItem?.idSiswa) {
      setValue('idSiswa', openItem.idSiswa, { shouldValidate: true });
    }
  }, [openItem, setValue]);

  /** ==============================
   * 🔹 QUERY 1 — Data Penilaian Kelas
   * ============================== */
  const { data: penilaianData, isLoading: isLoadingPenilaian } = useQuery({
    queryKey: ['penilaianKelas', idKelas],
    queryFn: async () => {
      const res = await api.get(`penilaian/kelas/${idKelas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data;
    },
    enabled: !!session?.user?.token
  });

  const jenisNilai = penilaianData?.jenisNilai ?? [];
  const nilaiSiswa = penilaianData?.nilaiSiswa ?? [];

  useEffect(() => {
    if (jenisNilai.length > 0) {
      setDefaultJenisNilai(jenisNilai[0]?.jenis);
    }
  }, [jenisNilai]);

  /** ==============================
   * 🔹 QUERY 2 — Data Tugas Summary
   * ============================== */
  const {
    data: tugasData,
    isLoading: isLoadingTugas,
    isError: isErrorTugas,
    error: errorTugas
  } = useQuery({
    queryKey: ['tugasSummary', id],
    queryFn: async () => {
      const response = await api.get(`tugas-summary/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return response.data.data as Materi;
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60
  });

  /** ==============================
   * 🔹 MUTATION — Koreksi AI
   * ============================== */
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY
  });

  const generateAIMutation = useMutation({
    mutationFn: async (prompt: string) => {
      setLoadingKoreksi(true);
      const response = await ai.models.generateContent({
        model: 'gemma-3-27b-it',
        contents: `
Hallo, tolong bantu saya mengoreksi jawaban dari soal berikut:
${tugasData?.konten}

Jika dalam soal terdapat link gambar, mohon telusuri dan pahami terlebih dahulu isi gambarnya sebelum menilai.

Jawaban siswa:
${prompt}

Berikan penilaian otomatis dengan skor maksimal 100, serta tampilkan hasil dalam format markdown yang rapi tanpa tambahan teks lain.

        `
      });
      return response.text;
    },
    onSuccess: (text) => {
      setJawaban(text);
      setLoadingKoreksi(false);
    },
    onError: () => {
      toast.error('Gagal koreksi dengan bantuan AI');
      setLoadingKoreksi(false);
    }
  });

  const KoreksiJawaban = (jawaban: string) => {
    generateAIMutation.mutate(jawaban);
  };

  /** ==============================
   * 🔹 MUTATION — Simpan Nilai
   * ============================== */
  const mutation = useMutation({
    mutationFn: async (form: FormValues) => {
      return api.post(
        `nilai-siswa`,
        {
          idSiswa: form.idSiswa,
          idKelasDanMapel: idKelas,
          idJenisNilai: form.idJenisNilai,
          nilai: form.nilai
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
    },
    onSuccess: () => {
      toast.success('Nilai berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['rekap-nilai', idKelas] });
      reset();
      setOpenItem(null);
    },
    onError: () => {
      toast.error('Gagal menyimpan nilai');
    }
  });

  const onSubmit = (form: FormValues) => {
    mutation.mutate(form);
  };

  /** ==============================
   * 🔹 Kondisi Loading & Error
   * ============================== */
  if (isLoadingPenilaian || isLoadingTugas) {
    return <p className='text-sm text-muted-foreground'>Loading...</p>;
  }

  if (isErrorTugas) {
    toast.error(
      (errorTugas as any)?.response?.data?.message || 'Gagal memuat tugas'
    );
    return <p className='text-sm text-red-500'>Gagal memuat data tugas.</p>;
  }

  /** ==============================
   * 🔹 Render Data
   * ============================== */
  const materi = tugasData;
  const filteredSummaries = materi?.SummaryTugas?.filter((s: any) =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-8'>
      {/* Section Materi */}
      <Card>
        <CardHeader>
          <CardTitle>📘 {materi?.judul}</CardTitle>
        </CardHeader>
        <CardContent className='prose max-w-none dark:prose-invert'>
          <div dangerouslySetInnerHTML={{ __html: materi?.konten }} />
          <div className='mx-auto w-full items-center justify-center'>
            <div
              className='mx-auto mb-10'
              dangerouslySetInnerHTML={{ __html: materi?.iframeYoutube }}
            />
            <div
              className='mx-auto'
              dangerouslySetInnerHTML={{ __html: materi?.iframeGoogleSlide }}
            />
            {materi?.pdfUrl && (
              <a
                href={materi.pdfUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                Lihat PDF
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Summary Siswa */}
      {/* Section Summary Siswa */}
      <Card className='w-full overflow-x-auto'>
        <CardHeader className='flex flex-col md:flex-row md:items-center md:justify-between'>
          <CardTitle className='text-base md:text-lg'>
            📋 Ringkasan Siswa
          </CardTitle>

          {/* 🔍 Input Search */}
          <Input
            placeholder='Cari nama siswa...'
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            className='mt-2 w-full md:mt-0 md:w-64'
          />
        </CardHeader>

        <CardContent>
          {filteredSummaries?.length === 0 ? (
            <p className='text-center text-sm text-muted-foreground'>
              {searchTerm
                ? 'Tidak ada siswa dengan nama tersebut.'
                : 'Belum ada siswa yang mengumpulkan ringkasan.'}
            </p>
          ) : (
            <Table className='w-[160%] overflow-x-auto md:w-full'>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Ringkasan</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSummaries?.map((s: any, index: number) => (
                  <TableRow key={s.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={s.fotoSiswa} />
                        <AvatarFallback>{s.nama?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className='max-w-[120px] truncate'>{s.nama}</span>
                    </TableCell>
                    <TableCell>
                      {s.waktu
                        ? format(
                            new Date(s.waktu),
                            "dd MMMM yyyy, HH:mm 'WIB'",
                            {}
                          )
                        : '-'}
                    </TableCell>
                    <TableCell className='max-w-[250px] truncate text-sm text-muted-foreground'>
                      {excerptFromHtml(s?.content, 100)}
                    </TableCell>
                    <TableCell>
                      {s?.fotoSummary?.length > 0 ? (
                        <Badge variant='secondary'>
                          {s.fotoSummary.length} Foto
                        </Badge>
                      ) : (
                        <Badge variant='outline'>Tidak Ada</Badge>
                      )}
                    </TableCell>

                    {/* 🔹 Tombol Detail */}
                    <TableCell className='text-right'>
                      <Dialog
                        open={openItem?.id === s.id}
                        onOpenChange={(open) => setOpenItem(open ? s : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant='outline' size='sm'>
                            Lihat Detail
                          </Button>
                        </DialogTrigger>

                        <DialogContent className='max-w-3xl dark:text-white'>
                          <DialogHeader>
                            <DialogTitle>{s.nama}</DialogTitle>
                            <DialogDescription>
                              {s.waktu
                                ? format(
                                    new Date(s.waktu),
                                    "dd MMMM yyyy, HH:mm 'WIB'",
                                    {}
                                  )
                                : '-'}
                            </DialogDescription>
                          </DialogHeader>

                          <div className='mt-4 max-h-[70vh] w-full overflow-auto'>
                            <div
                              dangerouslySetInnerHTML={{ __html: s?.content }}
                            />

                            {s?.fotoSummary?.length === 0 ? (
                              <Button
                                className='mt-3'
                                disabled={loadingKoreksi}
                                onClick={() => KoreksiJawaban(s?.content)}
                              >
                                {loadingKoreksi
                                  ? 'Sedang Mengkoreksi...'
                                  : 'Koreksi jawaban dengan bantuan AI ?'}
                              </Button>
                            ) : null}

                            {jawaban !== '' ? (
                              <div className='w-full'>
                                <MarkdownPreview content={jawaban} />
                              </div>
                            ) : null}

                            <form
                              onSubmit={handleSubmit(onSubmit)}
                              className='space-y-4'
                            >
                              {/* Pilih Jenis Nilai */}
                              <div className='mt-5'>
                                <Label>Siswa</Label>

                                {/* Tampilkan nama siswa */}
                                <Input value={s.nama} disabled />

                                <Label>Jenis Nilai</Label>
                                <Select
                                  onValueChange={(value) =>
                                    setValue('idJenisNilai', value, {
                                      shouldValidate: true
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Pilih jenis nilai' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jenisNilai.map((jn: any) => (
                                      <SelectItem key={jn.id} value={jn.id}>
                                        {jn.jenis} - {jn.bobot}%
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {errors.idJenisNilai && (
                                  <p className='mt-1 text-sm text-red-500'>
                                    Jenis nilai wajib dipilih
                                  </p>
                                )}
                                <input
                                  type='hidden'
                                  {...register('idJenisNilai', {
                                    required: true
                                  })}
                                />
                              </div>

                              {/* Pilih Siswa */}

                              {/* Input Nilai */}
                              <div>
                                <Label>Nilai</Label>
                                <Input
                                  type='number'
                                  min={0}
                                  max={100}
                                  {...register('nilai', {
                                    required: 'Nilai wajib diisi',
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Minimal 0' },
                                    max: { value: 100, message: 'Maksimal 100' }
                                  })}
                                />
                                {errors.nilai && (
                                  <p className='mt-1 text-sm text-red-500'>
                                    {errors.nilai.message}
                                  </p>
                                )}
                              </div>

                              {/* Tombol Simpan */}
                              <div className='flex justify-end gap-2 pt-2'>
                                <Button variant='outline' type='button'>
                                  Batal
                                </Button>
                                <Button
                                  type='submit'
                                  disabled={mutation.isPending}
                                >
                                  {mutation.isPending
                                    ? 'Menyimpan...'
                                    : 'Simpan'}
                                </Button>
                              </div>
                            </form>
                          </div>

                          {s?.fotoSummary?.length > 0 && (
                            <div className='mt-4 grid grid-cols-2 gap-3'>
                              {s.fotoSummary.map((foto: any, i: number) => (
                                <Dialog key={i}>
                                  <VisuallyHidden>
                                    <DialogTitle>Detail</DialogTitle>
                                  </VisuallyHidden>
                                  <DialogTrigger asChild>
                                    <Image
                                      src={foto.fotoUrl}
                                      alt={`summary-foto-${i}`}
                                      width={300}
                                      height={300}
                                      className='h-32 w-full cursor-pointer rounded-lg object-cover transition hover:opacity-80'
                                    />
                                  </DialogTrigger>
                                  <DialogContent className='max-w-5xl border-none bg-black/95 p-4'>
                                    <div className='flex flex-col items-center justify-center'>
                                      <Image
                                        src={foto.fotoUrl}
                                        alt={`foto-detail-${i}`}
                                        width={800}
                                        height={800}
                                        className='max-h-[80vh] w-auto rounded-lg object-contain'
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ))}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
