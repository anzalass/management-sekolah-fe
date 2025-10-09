'use client';

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TextEditor from '@/components/text-editor';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { GoogleGenAI } from '@google/genai';
import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface TambahMateriViewProps {
  idKelas: string;
  idMateri: string;
}

interface FormValues {
  judul: string;
  prompt: string;
  konten: string;
  iframeSlide: string;
  iframeYoutube: string;
}

export default function TambahMateriView({
  idKelas,
  idMateri
}: TambahMateriViewProps) {
  const { toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      judul: '',
      prompt: '',
      konten: '',
      iframeSlide: '',
      iframeYoutube: ''
    }
  });

  const promptValue = watch('prompt');

  // === FETCH DATA MATERI (kalau edit mode) ===
  const { data: materiData, isLoading } = useQuery({
    queryKey: ['materi', idMateri],
    queryFn: async () => {
      if (idMateri === 'new') return null;
      const res = await api.get(`materi/${idMateri}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user && idMateri !== 'new'
  });

  // Prefill form setelah data materi didapat
  useEffect(() => {
    if (materiData) {
      setValue('judul', materiData.judul || '');
      setValue('konten', materiData.konten || '');
      setValue('iframeSlide', materiData.iframeGoogleSlide || '');
      setValue('iframeYoutube', materiData.iframeYoutube || '');
    }
  }, [materiData, setValue]);

  // === Google AI ===
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY
  });

  // === CREATE / UPDATE MUTATION ===
  const materiMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append('judul', data.judul);
      formData.append('idKelasMapel', idKelas);
      formData.append('konten', data.konten);
      formData.append('iframeGoogleSlide', data.iframeSlide);
      formData.append('iframeYoutube', data.iframeYoutube);
      if (pdfFile) formData.append('pdf', pdfFile);

      const isEdit = idMateri !== 'new';
      const endpoint = isEdit ? `materi/${idMateri}` : `materi`;
      const method = isEdit ? api.put : api.post;

      return await method(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success(
        idMateri === 'new'
          ? 'Materi berhasil dibuat'
          : 'Materi berhasil diperbarui'
      );
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', idKelas] });
      router.push(`/mengajar/kelas-mapel/${idKelas}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const onSubmit = (data: FormValues) => {
    if (!data.judul.trim() || !data.konten.trim()) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }
    materiMutation.mutate(data);
  };

  const generateAIMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await ai.models.generateContent({
        model: 'gemma-3-27b-it',
        contents: `${prompt}, output nya html aja, tetapi tanpa tag <html> dan tanpa css`
      });
      return response.text;
    },
    onSuccess: (text) => {
      if (text && editorInstance) {
        editorInstance.commands.setContent(text);
        setValue('konten', text);
        toast.success('Konten AI berhasil dibuat');
      }
    },
    onError: () => {
      toast.error('Gagal generate AI');
    }
  });

  // === Generate Materi dari AI ===
  const handleGenerateAI = () => {
    const promptValue = watch('prompt');
    if (!promptValue.trim()) {
      toast.error('Prompt tidak boleh kosong');
      return;
    }
    generateAIMutation.mutate(promptValue);
  };

  // === Loading state saat ambil data edit ===
  if (isLoading) {
    return (
      <p className='p-6 text-center text-gray-500'>Memuat data materi...</p>
    );
  }

  return (
    <div className='h-screen w-full'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label>Judul Materi</label>
          <Input
            {...register('judul', { required: 'Judul materi wajib diisi' })}
          />
          {errors.judul && (
            <p className='text-sm text-red-500'>{errors.judul.message}</p>
          )}
        </div>

        <div>
          <label>Prompt Materi By AI</label>
          <Input
            {...register('prompt')}
            placeholder='Contoh: Materi Pencernaan'
          />
        </div>

        <div>
          <label>Konten</label>
          <Controller
            name='konten'
            control={control}
            render={({ field }) => (
              <TextEditor
                type='materi'
                value={field.value}
                onChange={field.onChange}
                editorRef={setEditorInstance}
              />
            )}
          />
        </div>

        <div>
          <label>Iframe Google Slide</label>
          <Input {...register('iframeSlide')} placeholder='URL iframe slide' />
        </div>

        <div>
          <label>Iframe YouTube</label>
          <Input
            {...register('iframeYoutube')}
            placeholder='URL iframe YouTube'
          />
        </div>

        <div className='flex gap-2'>
          <Button type='submit' disabled={materiMutation.isPending}>
            {materiMutation.isPending
              ? idMateri === 'new'
                ? 'Menyimpan...'
                : 'Memperbarui...'
              : idMateri === 'new'
                ? 'Simpan Materi'
                : 'Simpan Perubahan'}
          </Button>
          <Button
            type='button'
            variant='outline'
            disabled={generateAIMutation.isPending}
            onClick={handleGenerateAI}
          >
            {generateAIMutation.isPending
              ? 'Loading...'
              : 'Generate Tugas By AI'}
          </Button>
        </div>
      </form>
    </div>
  );
}
