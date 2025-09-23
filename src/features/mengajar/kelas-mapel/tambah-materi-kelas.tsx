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
import axios from 'axios';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { GoogleGenAI } from '@google/genai';
import api from '@/lib/api';

interface ModalMateriProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idKelas: string;
}

interface FormValues {
  judul: string;
  prompt: string;
  konten: string;
  iframeSlide: string;
  iframeYoutube: string;
}

export default function ModalMateri({
  open,
  onOpenChange,
  idKelas
}: ModalMateriProps) {
  const { toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);

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

  const ai = new GoogleGenAI({
    apiKey: 'AIzaSyAaiszp38RzeZquyKjOsB3kbDVIVc7eRvc'
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.judul.trim() || !data.konten.trim()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('judul', data.judul);
      formData.append('idKelasMapel', idKelas);
      formData.append('konten', data.konten);
      formData.append('iframeGoogleSlide', data.iframeSlide);
      formData.append('iframeYoutube', data.iframeYoutube);

      if (pdfFile) formData.append('pdf', pdfFile);

      await api.post(`materi`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success('Berhasil membuat materi');
      reset();
      onOpenChange(false);
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
      setPdfFile(null);
    }
  };

  const generateAireal = async () => {
    if (!promptValue.trim()) {
      toast.error('Prompt tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemma-3-27b-it',
        contents: `${promptValue}, output nya html aja gausa ada css nya` // gunakan prompt dari input
      });

      if (response.text && editorInstance) {
        // langsung set konten di editor
        editorInstance.commands.setContent(response.text);
        // update form value juga

        setValue('konten', response.text);
        toast.success('Konten AI berhasil dibuat');
      }
    } catch (err) {
      toast.error('Gagal generate konten AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-screen max-w-7xl overflow-auto'>
        <VisuallyHidden>
          <DialogTitle>Tambah Materi</DialogTitle>
        </VisuallyHidden>
        <DialogHeader></DialogHeader>

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
                  editorRef={setEditorInstance} // pasang editorRef supaya bisa set content dari luar
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

          <div>
            <label>Upload PDF</label>
            <Input
              type='file'
              accept='application/pdf'
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
            {pdfFile && (
              <p className='text-sm text-muted-foreground'>{pdfFile.name}</p>
            )}
          </div>

          <div className='flex gap-2'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Materi'}
            </Button>
            <Button
              type='button'
              variant='outline'
              disabled={isLoading}
              onClick={generateAireal}
            >
              {isLoading ? 'Loading...' : 'Generate Materi By AI'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
