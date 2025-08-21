'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import React, { useState } from 'react';
import { API } from '@/lib/server';

type Props = {
  open: boolean;
  onClose: () => void;
  idKelas: string | null;
  fetchData: () => void;
  jenis: string;
};

export default function ModalHapusKelas({
  open,
  onClose,
  idKelas,
  fetchData,
  jenis
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!idKelas) {
      toast.error('ID Kelas tidak tersedia');
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        jenis === 'mapel'
          ? `${process.env.NEXT_PUBLIC_API_URL}kelas-mapel/delete/${idKelas}`
          : `${process.env.NEXT_PUBLIC_API_URL}kelas-walikelas/delete/${idKelas}`;

      await axios.delete(endpoint);

      toast.success('Kelas berhasil dihapus');
      fetchData();
      onClose();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || 'Terjadi kesalahan saat menghapus';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus kelas ini? Tindakan ini tidak bisa
            dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-4'>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
