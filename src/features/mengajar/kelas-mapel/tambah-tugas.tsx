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

interface Tugas {
  id: number;
  idKelas: string;
  judul: string;
  konten: string;
  iframeSlide?: string;
  iframeYoutube?: string;
  pdfFile?: File | null;
  link?: string;
}

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
  const { toggleTrigger } = useRenderTrigger();

  const { register, handleSubmit, control, reset, setValue } =
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
  const [TugasList, setTugasList] = useState<Tugas[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: FormValues) => {
    if (!data.judul.trim() || !data.konten.trim()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('judul', data.judul);
      formData.append('idKelasMapel', idKelas);
      formData.append('konten', data.konten);
      formData.append('deadline', data.deadline);
      formData.append('iframeGoogleSlide', data.iframeSlide);
      formData.append('iframeYoutube', data.iframeYoutube);

      if (pdfFile !== null) {
        formData.append('pdf', pdfFile);
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}tugas`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success('Berhasil membuat Tugas');
      reset();
      onOpenChange(false); // tutup modal setelah submit
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal menyimpan Tugas');
    } finally {
      setIsLoading(false);
      setPdfFile(null);
    }
  };

  const handleGenerateAI = () => {
    setValue('judul', 'Pengantar Algoritma');
    setValue(
      'konten',
      'Tugas ini membahas tentang konsep dasar algoritma dan logika.'
    );
  };

  const handleDelete = (id: number) => {
    setTugasList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-screen max-w-5xl overflow-auto'>
        <p>Tambah Tugas</p>
        <DialogHeader></DialogHeader>

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
              {isLoading ? 'Menyimpan...' : 'Simpan Tugas'}
            </Button>
            <Button type='button' variant='outline' onClick={handleGenerateAI}>
              Generate Tugas dengan AI
            </Button>
          </div>
        </form>

        {/* Optional preview */}
        {/* <div
          className='prose max-w-none mt-6'
          dangerouslySetInnerHTML={{ __html: watch('konten') }}
        ></div> */}
      </DialogContent>
    </Dialog>
  );
}
