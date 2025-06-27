'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface Tugas {
  id: number;
  judul: string;
  deskripsi: string;
}

interface ModalTugasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalTugas({ open, onOpenChange }: ModalTugasProps) {
  const [judulTugas, setJudulTugas] = useState('');
  const [deskripsiTugas, setDeskripsiTugas] = useState('');
  const [tugasList, setTugasList] = useState<Tugas[]>([]);

  const handleAddTugas = () => {
    if (!judulTugas.trim() || !deskripsiTugas.trim()) return;

    const newTugas: Tugas = {
      id: Date.now(),
      judul: judulTugas.trim(),
      deskripsi: deskripsiTugas.trim()
    };

    setTugasList((prev) => [...prev, newTugas]);
    setJudulTugas('');
    setDeskripsiTugas('');
  };

  const handleDelete = (id: number) => {
    setTugasList((prev) => prev.filter((tugas) => tugas.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Tambah Tugas</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Label>Judul Tugas</Label>
            <Input
              value={judulTugas}
              onChange={(e) => setJudulTugas(e.target.value)}
              placeholder='Masukkan judul tugas'
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <Textarea
              value={deskripsiTugas}
              onChange={(e) => setDeskripsiTugas(e.target.value)}
              placeholder='Masukkan deskripsi tugas'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button onClick={handleAddTugas}>Simpan Tugas</Button>
          </div>

          <div className='pt-4'>
            <h4 className='text-md font-semibold'>Daftar Tugas</h4>
            {tugasList.length === 0 ? (
              <p className='text-sm text-muted-foreground'>Belum ada tugas.</p>
            ) : (
              <div className='space-y-2'>
                {tugasList.map((tugas) => (
                  <Card
                    key={tugas.id}
                    className='relative rounded-md p-4 shadow-sm'
                  >
                    <button
                      onClick={() => handleDelete(tugas.id)}
                      className='absolute right-2 top-2 text-gray-500 hover:text-red-500'
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className='font-semibold'>{tugas.judul}</div>
                    <div className='text-sm text-muted-foreground'>
                      {tugas.deskripsi}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
