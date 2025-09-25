'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import api from '@/lib/api';

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
  const [data, setData] = useState<UjianIframe | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/ujian-iframe-guru/${id}`);
        setData(res.data);
      } catch (err) {
        toast.error('Gagal mengambil data ujian');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/selesai-ujian/delete/${selectedId}`);
      toast.success('Data berhasil dihapus');
      // refresh data
      setData((prev) =>
        prev
          ? {
              ...prev,
              SelesaiUjian: prev.SelesaiUjian.filter((s) => s.id !== selectedId)
            }
          : prev
      );
    } catch (err) {
      toast.error('Gagal menghapus data');
    } finally {
      setOpenConfirm(false);
    }
  };

  if (loading) return <p className='py-6 text-center'>Loading...</p>;

  if (!data) return <p className='py-6 text-center'>Data tidak ditemukan</p>;

  return (
    <div className='space-y-6'>
      {/* Card info ujian */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>{data.nama}</CardTitle>
          {/* <div className='text-sm text-muted-foreground'>
            Deadline:{' '}
            {data.deadline
              ? format(new Date(data.deadline), 'dd MMMM yyyy HH:mm', {
                  locale: id
                })
              : '-'}
          </div> */}
        </CardHeader>
        <CardContent>
          <div className='aspect-video w-full overflow-hidden rounded-lg border'>
            <iframe
              src={data.iframe}
              title='Ujian'
              className='h-full w-full'
              allowFullScreen
            />
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
                    {/* <TableCell>
                      {format(new Date(item.createdAt), 'dd MMMM yyyy HH:mm', {
                        locale: id
                      })}
                    </TableCell> */}
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
            <Button variant='destructive' onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
