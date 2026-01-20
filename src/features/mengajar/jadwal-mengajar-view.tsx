'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import ModalTambahJadwal from './modal-tambah-jadwal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Jadwal {
  id: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  kelas: string;
  namaMapel: string;
  ruang: string;
}

export default function JadwalMengajarView() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showJadwalModal, setShowJadwalModal] = useState(false);

  // urutan hari
  const hariOrder = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu'
  ];

  // Fetch data jadwal
  const {
    data: jadwal = [],
    isLoading,
    isError
  } = useQuery<Jadwal[]>({
    queryKey: ['jadwalMengajar'],
    queryFn: async () => {
      const res = await api.get('jadwal-guru', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      // sort hari + jam
      const sortedData = res.data.data.sort((a: any, b: any) => {
        const dayDiff = hariOrder.indexOf(a.hari) - hariOrder.indexOf(b.hari);
        if (dayDiff === 0) {
          return a.jamMulai.localeCompare(b.jamMulai);
        }
        return dayDiff;
      });

      return sortedData;
    },
    enabled: !!session?.user?.token
  });

  // Mutation hapus jadwal
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`jadwal-mengajar/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success('Jadwal berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['jadwalMengajar'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  return (
    <Card className='shadow-md'>
      <ModalTambahJadwal
        fetchData={() =>
          queryClient.invalidateQueries({ queryKey: ['jadwalMengajar'] })
        }
        openModal={showJadwalModal}
        setOpenModal={setShowJadwalModal}
      />
      <CardHeader className='flex flex-row items-center gap-2'>
        <Button variant='outline' onClick={() => setShowJadwalModal(true)}>
          Tambah Jadwal +
        </Button>
      </CardHeader>
      <CardContent className='w-full overflow-x-auto'>
        {isLoading ? (
          <p className='text-sm italic text-muted-foreground'>Memuat...</p>
        ) : isError ? (
          <p className='text-sm text-red-500'>Gagal memuat data.</p>
        ) : jadwal.length > 0 ? (
          <Table className='w-[150%] sm:w-full'>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Ruang Kelas</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwal.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.hari}</TableCell>
                  <TableCell>
                    {item.jamMulai} - {item.jamSelesai}
                  </TableCell>
                  <TableCell>{item.kelas}</TableCell>
                  <TableCell>{item.namaMapel}</TableCell>
                  <TableCell>{item.ruang}</TableCell>
                  <TableCell>
                    <Button
                      variant='destructive'
                      size='sm'
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      {deleteMutation.isPending ? (
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
