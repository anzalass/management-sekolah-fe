'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';

interface Perizinan {
  id: string;
  idSiswa: string;
  idKelas: string;
  jenis: string;
  keterangan: string;
  time: string;
  bukti: string;
  bukti_id: string;
  status: string;
  namaSiswa: string | null;
  nisSiswa: string | null;
  namaKelas: string | null;
}

type Props = {
  idKelas: string;
};

export default function PerizinanSiswaView({ idKelas }: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedBukti, setSelectedBukti] = useState<string | null>(null);

  const token = session?.user?.token;

  // ✅ Query ambil data
  const { data: perizinan = [], isLoading } = useQuery<Perizinan[]>({
    queryKey: ['perizinan', idKelas],
    queryFn: async () => {
      const res = await api.get(`perizinan-siswa-hari-ini/${idKelas}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    },
    enabled: !!token && !!idKelas
  });

  // ✅ Mutation setujui
  const setujuiMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(
        `perizinan-siswa-status/${id}`,
        { status: 'disetujui' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Perizinan disetujui');
      queryClient.invalidateQueries({ queryKey: ['perizinan', idKelas] });
    },
    onError: () => {
      toast.error('Gagal setujui');
    }
  });

  // ✅ Mutation tolak
  const tolakMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(
        `perizinan-siswa-status/${id}`,
        { status: 'ditolak' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Perizinan ditolak');
      queryClient.invalidateQueries({ queryKey: ['perizinan', idKelas] });
    },
    onError: () => {
      toast.error('Gagal tolak');
    }
  });

  return (
    <Card className='p-5'>
      <h1 className='mb-4 text-base font-semibold'>Daftar Perizinan Siswa</h1>
      <div className='rounded-xl border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>NIS</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bukti</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={10} className='text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && perizinan.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className='text-center'>
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
            {perizinan.map((izin, idx) => (
              <TableRow key={izin.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{izin.namaSiswa}</TableCell>
                <TableCell>{izin.nisSiswa}</TableCell>
                <TableCell>{izin.namaKelas}</TableCell>
                <TableCell>{izin.keterangan}</TableCell>
                <TableCell>
                  {new Date(izin.time).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      izin.status === 'disetujui'
                        ? 'bg-green-100 text-green-700'
                        : izin.status === 'ditolak'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {izin.status}
                  </span>
                </TableCell>
                <TableCell>
                  {izin.bukti ? (
                    <Dialog
                      open={selectedBukti === izin.bukti}
                      onOpenChange={(open) =>
                        setSelectedBukti(open ? izin.bukti : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <button className='text-blue-600 hover:underline'>
                          Lihat
                        </button>
                      </DialogTrigger>
                      <DialogContent className='max-w-2xl'>
                        <DialogHeader>
                          <DialogTitle>Bukti Perizinan</DialogTitle>
                        </DialogHeader>
                        <div className='mt-4'>
                          {izin.bukti.endsWith('.pdf') ? (
                            <iframe
                              src={izin.bukti}
                              className='h-[500px] w-full rounded-md'
                            />
                          ) : (
                            <img
                              src={izin.bukti}
                              alt='Bukti'
                              className='mx-auto max-h-[500px] w-auto rounded-md'
                            />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className='flex gap-2'>
                  <Button
                    size='sm'
                    className='bg-green-600 text-white hover:bg-green-700'
                    onClick={() => setujuiMutation.mutate(izin.id)}
                    disabled={setujuiMutation.isPending}
                  >
                    {setujuiMutation.isPending ? '...' : 'Setujui'}
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => tolakMutation.mutate(izin.id)}
                    disabled={tolakMutation.isPending}
                  >
                    {tolakMutation.isPending ? '...' : 'Tolak'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
