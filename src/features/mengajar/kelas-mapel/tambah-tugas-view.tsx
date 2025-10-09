'use client';

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TextEditor from '@/components/text-editor';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { GoogleGenAI } from '@google/genai';
import { useRouter } from 'next/navigation';

interface TambahTugasProps {
  idKelas: string;
  idTugas: string;
}

interface FormValues {
  judul: string;
  prompt: string;
  konten: string;
  deadline: string;
  iframeSlide: string;
  iframeYoutube: string;
}

export default function TambahTugasView({
  idKelas,
  idTugas
}: TambahTugasProps) {
  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        judul: '',
        prompt: '',
        konten: '',
        iframeSlide: '',
        iframeYoutube: '',
        deadline: ''
      }
    });

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const router = useRouter();

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY
  });

  // 🔹 GET data tugas kalau idTugas !== "new"
  const { data: tugasData, isLoading: tugasLoading } = useQuery({
    queryKey: ['tugas', idTugas],
    queryFn: async () => {
      const res = await api.get(`tugas/${idTugas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    },
    enabled: idTugas !== 'new' && !!session?.user?.token
  });

  console.log(tugasData);

  // Prefill form ketika data tugas berhasil didapat
  useEffect(() => {
    if (tugasData && idTugas !== 'new') {
      setValue('judul', tugasData.judul || '');
      setValue('konten', tugasData.konten || '');
      setValue('deadline', tugasData.deadline?.slice(0, 10) || '');
      setValue('iframeSlide', tugasData.iframeGoogleSlide || '');
      setValue('iframeYoutube', tugasData.iframeYoutube || '');
    }
  }, [tugasData, idTugas, setValue]);

  // 🔹 Mutation: Create / Update Tugas
  const saveTugasMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append('judul', data.judul);
      formData.append('idKelasMapel', idKelas);
      formData.append('konten', data.konten);
      formData.append('deadline', data.deadline);
      formData.append('iframeGoogleSlide', data.iframeSlide);
      formData.append('iframeYoutube', data.iframeYoutube);
      if (pdfFile) formData.append('pdf', pdfFile);

      const endpoint = idTugas !== 'new' ? `tugas/${idTugas}` : `tugas`;
      const method = idTugas !== 'new' ? api.put : api.post;

      return method(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success(
        idTugas !== 'new'
          ? 'Tugas berhasil diperbarui'
          : 'Tugas berhasil dibuat'
      );
      reset();
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', idKelas] });
      router.push(`/mengajar/kelas-mapel/${idKelas}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  // 🔹 Mutation: Generate konten AI
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

  const onSubmit = (data: FormValues) => {
    if (!data.judul.trim() || !data.konten.trim()) {
      toast.error('Judul dan Konten tidak boleh kosong');
      return;
    }
    saveTugasMutation.mutate(data);
  };

  const handleGenerateAI = () => {
    const promptValue = watch('prompt');
    if (!promptValue.trim()) {
      toast.error('Prompt tidak boleh kosong');
      return;
    }
    generateAIMutation.mutate(promptValue);
  };

  if (tugasLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p>Memuat data tugas...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full'>
      <p className='mb-3 text-lg font-semibold'>
        {idTugas !== 'new' ? 'Edit Tugas' : 'Tambah Tugas'}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label>Judul Tugas</label>
          <Input {...register('judul')} />
        </div>
        <div>
          <label>Prompt Tugas By AI</label>
          <Input
            {...register('prompt')}
            placeholder='Contoh: Materi IPA Kelas 6'
          />
        </div>
        <div>
          <label>Deadline</label>
          <Input type='date' {...register('deadline')} />
        </div>

        <div>
          <label>Konten</label>
          <Controller
            name='konten'
            control={control}
            render={({ field }) => (
              <TextEditor
                type='tugas'
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
          <Button type='submit' disabled={saveTugasMutation.isPending}>
            {saveTugasMutation.isPending
              ? 'Menyimpan...'
              : idTugas !== 'new'
                ? 'Simpan Perubahan'
                : 'Simpan Tugas'}
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
