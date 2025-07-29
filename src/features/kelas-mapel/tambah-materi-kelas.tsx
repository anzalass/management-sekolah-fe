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

interface Materi {
  id: number;
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
}

interface FormValues {
  judul: string;
  konten: string;
  iframeSlide: string;
  iframeYoutube: string;
}

export default function ModalMateri({ open, onOpenChange }: ModalMateriProps) {
  const { register, handleSubmit, control, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        judul: '',
        konten: '',
        iframeSlide: '',
        iframeYoutube: ''
      }
    });

  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const onSubmit = (data: FormValues) => {
    if (!data.judul.trim() || !data.konten.trim()) return;

    const newMateri: Materi = {
      id: Date.now(),
      judul: data.judul,
      konten: data.konten,
      iframeSlide: data.iframeSlide,
      iframeYoutube: data.iframeYoutube,
      pdfFile
    };

    setMateriList((prev) => [...prev, newMateri]);
    reset();
    setPdfFile(null);
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
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Tambah Materi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label>Judul Materi</label>
            <Input {...register('judul')} />
          </div>

          <div>
            <label>Konten</label>
            <Controller
              name='konten'
              control={control}
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} />
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
            <Button type='submit'>Simpan Materi</Button>
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
