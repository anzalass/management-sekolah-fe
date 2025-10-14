'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

type SelesaiUjian = {
  id: string;
  idSiswa: string;
  status: string;
  createdAt: string;
  Siswa?: {
    nama?: string;
    nis?: string;
  };
};

type UjianIframe = {
  id: string;
  nama: string;
  deadline: string;
  iframe: string;
  SelesaiUjian: SelesaiUjian[];
};

export default function DetailUjianView({ id }: { id: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  // ✅ Fetch ujian
  const { data, isLoading, isError } = useQuery<UjianIframe>({
    queryKey: ['ujian-iframe', id],
    queryFn: async () => {
      const res = await api.get(`ujian-iframe-guru/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data;
    }
  });

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`selesai-ujian/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success('Data berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['ujian-iframe', id] });
      setOpenConfirm(false);
    },
    onError: () => {
      toast.error('Gagal menghapus data');
    }
  });

  const handleDelete = () => {
    if (selectedId) {
      deleteMutation.mutate(selectedId);
    }
  };

  if (isLoading) return <p className='py-6 text-center'>Loading...</p>;
  if (isError || !data)
    return <p className='py-6 text-center'>Data tidak ditemukan</p>;

  return (
    <div className='space-y-6'>
      {/* Card info ujian */}

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>{data.nama}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='aspect-video w-full overflow-hidden rounded-lg border'>
            {data.iframe ? (
              <iframe
                src={data.iframe}
                title='Ujian'
                className='h-full w-full'
                allowFullScreen
              />
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Tabel selesai ujian */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Daftar Selesai Ujian</CardTitle>
        </CardHeader>
        <CardContent>
          {data.SelesaiUjian.length === 0 ? (
            <p className='text-center text-sm text-muted-foreground'>
              Belum ada siswa yang menyelesaikan ujian.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.SelesaiUjian.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.Siswa?.nama ?? 'Siswa'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.status === 'selesai'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-400 text-black'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => {
                          setSelectedId(item.id);
                          setOpenConfirm(true);
                        }}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog konfirmasi delete */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            Apakah Anda yakin ingin menghapus data ini?
          </p>
          <DialogFooter className='mt-4'>
            <Button variant='outline' onClick={() => setOpenConfirm(false)}>
              Batal
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
