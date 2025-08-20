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

interface Materi {
  id: number;
  idKelas: string;
  judul: string;
  konten: string;
  iframeSlide?: string;
  iframeYoutube?: string;
  pdfFile?: File | null;
  link?: string;
}

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

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
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
  const { data: session } = useSession();
  const [materiList, setMateriList] = useState<Materi[]>([]);
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
      formData.append('iframeGoogleSlide', data.iframeSlide);
      formData.append('iframeYoutube', data.iframeYoutube);

      if (pdfFile !== null) {
        formData.append('pdf', pdfFile);
      }

      await axios.post(`${API}materi`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success('Berhasil membuat materi');
      reset();
      onOpenChange(false); // tutup modal setelah submit
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal menyimpan materi');
    } finally {
      setIsLoading(false);
      setPdfFile(null);
    }
  };

  const handleGenerateAI = () => {
    setValue('judul', 'Pengantar Algoritma');
    setValue(
      'konten',
      'Materi ini membahas tentang konsep dasar algoritma dan logika.'
    );
  };

  const handleDelete = (id: number) => {
    setMateriList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-screen max-w-7xl overflow-auto'>
        <p>Tambah Materi</p>
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
            <Input {...register('prompt')} />
            {/* Prompt tidak required, jadi tidak perlu pesan error */}
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
            <Button type='button' variant='outline' onClick={handleGenerateAI}>
              Generate Materi dengan AI
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
