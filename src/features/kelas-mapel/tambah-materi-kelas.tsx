'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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

export default function ModalMateri({ open, onOpenChange }: ModalMateriProps) {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [judulMateri, setJudulMateri] = useState('');
  const [kontenMateri, setKontenMateri] = useState('');
  const [iframeSlide, setIframeSlide] = useState('');
  const [iframeYoutube, setIframeYoutube] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleAddMateri = () => {
    if (!judulMateri.trim() || !kontenMateri.trim()) return;

    const newMateri: Materi = {
      id: Date.now(),
      judul: judulMateri,
      konten: kontenMateri,
      iframeSlide,
      iframeYoutube,
      pdfFile
    };

    setMateriList((prev) => [...prev, newMateri]);
    setJudulMateri('');
    setKontenMateri('');
    setIframeSlide('');
    setIframeYoutube('');
    setPdfFile(null);
  };

  const handleGenerateAI = () => {
    setJudulMateri('Pengantar Algoritma');
    setKontenMateri(
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

        <div className='space-y-4'>
          <div>
            <label>Judul Materi</label>
            <Input
              value={judulMateri}
              onChange={(e) => setJudulMateri(e.target.value)}
            />
          </div>

          <div>
            <label>Konten Materi</label>
            <Textarea
              value={kontenMateri}
              onChange={(e) => setKontenMateri(e.target.value)}
            />
          </div>

          <div>
            <label>Iframe Google Slide</label>
            <Input
              value={iframeSlide}
              onChange={(e) => setIframeSlide(e.target.value)}
              placeholder='URL iframe slide'
            />
          </div>

          <div>
            <label>Iframe YouTube</label>
            <Input
              value={iframeYoutube}
              onChange={(e) => setIframeYoutube(e.target.value)}
              placeholder='URL iframe youtube'
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
            <Button onClick={handleAddMateri}>Simpan Materi</Button>
            <Button variant='outline' onClick={handleGenerateAI}>
              Generate Materi dengan AI
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
