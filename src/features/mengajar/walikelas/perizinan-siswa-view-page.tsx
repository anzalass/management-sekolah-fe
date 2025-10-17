'use client';

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
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

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

export default function PerizinanSiswaViewPage({ idKelas }: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [selectedBukti, setSelectedBukti] = useState<string | null>(null);
  const [searchNama, setSearchNama] = useState('');
  const [searchTanggal, setSearchTanggal] = useState('');

  // 👉 fetch perizinan siswa
  const { data, isLoading, isError } = useQuery({
    queryKey: ['perizinan-siswa', idKelas],
    queryFn: async (): Promise<Perizinan[]> => {
      const res = await api.get(`perizinan-siswa-kelas/${idKelas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data ?? [];
    },
    enabled: !!session?.user?.token // hanya jalan kalau token ada
  });

  // 👉 mutation approve/tolak
  const mutation = useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string;
      status: 'disetujui' | 'ditolak';
    }) => {
      await api.patch(
        `perizinan-siswa-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Perizinan ${variables.status === 'disetujui' ? 'disetujui' : 'ditolak'}`
      );
      queryClient.invalidateQueries({ queryKey: ['perizinan-siswa', idKelas] });
    },
    onError: () => {
      toast.error('Gagal update perizinan');
    }
  });

  // 👉 filter logic
  const filteredData =
    data?.filter((izin) => {
      const matchNama = izin.namaSiswa
        ?.toLowerCase()
        .includes(searchNama.toLowerCase());
      const matchTanggal = searchTanggal
        ? new Date(izin.time).toISOString().slice(0, 10) === searchTanggal
        : true;

      return matchNama && matchTanggal;
    }) ?? [];

  return (
    <div>
      <h1 className='mb-4 text-sm font-semibold md:text-xl'>
        Daftar Perizinan Siswa - {data?.[0]?.namaKelas ?? ''}
      </h1>

      {/* Filter Bar */}
      <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4'>
        <div className='flex flex-col'>
          <Input
            id='nama'
            placeholder='Nama Siswa'
            value={searchNama}
            onChange={(e) => setSearchNama(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <Input
            id='tanggal'
            type='date'
            value={searchTanggal}
            onChange={(e) => setSearchTanggal(e.target.value)}
          />
        </div>
      </div>

      <div className='rounded-xl border'>
        {isLoading ? (
          <div className='p-4 text-center text-muted-foreground'>
            Memuat data...
          </div>
        ) : isError ? (
          <div className='p-4 text-center text-red-500'>Gagal memuat data</div>
        ) : (
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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className='text-center'>
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((izin, idx) => (
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
                        disabled={mutation.isPending}
                        onClick={() =>
                          mutation.mutate({ id: izin.id, status: 'disetujui' })
                        }
                      >
                        Setujui
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        disabled={mutation.isPending}
                        onClick={() =>
                          mutation.mutate({ id: izin.id, status: 'ditolak' })
                        }
                      >
                        Tolak
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
