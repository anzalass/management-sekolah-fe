'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Clock, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const today = new Date()
  .toLocaleDateString('id-ID', {
    weekday: 'long'
  })
  .toLowerCase();

type Props = {
  jadwalGuru: any[];
};

export default function ListJadwalGuru({ jadwalGuru }: Props) {
  const { data: session } = useSession();
  const [dateStr, setDateStr] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setDateStr(formatter.format(new Date()));
  }, []);

  // ==============================
  // MUTATION: Delete jadwal
  // ==============================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      await api.delete(`jadwal-mengajar/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success('Jadwal berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] });
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      setDeletingId(null);
    }
  });

  if (!dateStr) {
    return (
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const jadwalHariIni = jadwalGuru.filter(
    (jadwal) => jadwal.hari?.toLowerCase() === today
  );

  return (
    <Card className='shadow-md'>
      <CardHeader className='flex flex-row items-center gap-2'>
        <Clock className='h-5 w-5 text-primary' />
        <CardTitle className='text-base lg:text-lg'>
          Jadwal Hari Ini ({dateStr})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {jadwalHariIni.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jam</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Ruang Kelas</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwalHariIni.map((jadwal, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {jadwal.jamMulai} - {jadwal.jamSelesai}
                  </TableCell>
                  <TableCell>{jadwal.namaMapel}</TableCell>
                  <TableCell>{jadwal.kelas}</TableCell>
                  <TableCell>{jadwal.ruang}</TableCell>
                  <TableCell>
                    <Button
                      variant='destructive'
                      size='sm'
                      disabled={deletingId === jadwal.id}
                      onClick={() => deleteMutation.mutate(jadwal.id)}
                    >
                      {deletingId === jadwal.id ? (
                        <span className='text-xs'>Menghapus...</span>
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className='text-sm italic text-muted-foreground'>
            Tidak ada jadwal hari ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
