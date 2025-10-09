'use client';

import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TextEditor from '@/components/text-editor';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { GoogleGenAI } from '@google/genai';

interface ModalTugasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idKelas: string;
}

interface FormValues {
  judul: string;
  prompt: string;
  konten: string;
  deadline: string;
  iframeSlide: string;
  iframeYoutube: string;
}

export default function ModalTugas({
  open,
  onOpenChange,
  idKelas
}: ModalTugasProps) {
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

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY
  });

  // 🔹 Mutation: Create Tugas
  const createTugasMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append('judul', data.judul);
      formData.append('idKelasMapel', idKelas);
      formData.append('konten', data.konten);
      formData.append('deadline', data.deadline);
      formData.append('iframeGoogleSlide', data.iframeSlide);
      formData.append('iframeYoutube', data.iframeYoutube);

      if (pdfFile) formData.append('pdf', pdfFile);

      return api.post(`Tugas`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success('Berhasil membuat Tugas');
      reset();
      setPdfFile(null);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', idKelas] });
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
        contents: `${prompt}, output nya html aja, tetapi tanpa tag html gausa ada css nya`
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal generate AI');
    }
  });

  const onSubmit = (data: FormValues) => {
    if (!data.judul.trim() || !data.konten.trim()) {
      toast.error('Judul dan Konten tidak boleh kosong');
      return;
    }
    createTugasMutation.mutate(data);
  };

  const handleGenerateAI = () => {
    const promptValue = watch('prompt');
    if (!promptValue.trim()) {
      toast.error('Prompt tidak boleh kosong');
      return;
    }
    generateAIMutation.mutate(promptValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-screen max-w-5xl overflow-auto'>
        <VisuallyHidden>
          <DialogTitle>Tambah Tugas</DialogTitle>
        </VisuallyHidden>
        <DialogHeader />

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label>Judul Tugas</label>
            <Input {...register('judul')} />
          </div>
          <div>
            <label>Prompt Tugas By AI</label>
            <Input {...register('prompt')} />
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
            <Input
              {...register('iframeSlide')}
              placeholder='URL iframe slide'
            />
          </div>

          <div>
            <label>Iframe YouTube</label>
            <Input
              {...register('iframeYoutube')}
              placeholder='URL iframe YouTube'
            />
          </div>

          <div className='flex gap-2'>
            <Button type='submit' disabled={createTugasMutation.isPending}>
              {createTugasMutation.isPending ? 'Menyimpan...' : 'Simpan Tugas'}
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
      </DialogContent>
    </Dialog>
  );
}
