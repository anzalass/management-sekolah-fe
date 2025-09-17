'use client';

import React, { useEffect, useState } from 'react';
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
  const [data, setData] = useState<Perizinan[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const res = await api.get(`perizinan-siswa-hari-ini/${idKelas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setData(res.data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal ambil data');
    }
  };

  const handleSetujui = async (id: string) => {
    try {
      await api.patch(
        `perizinan-siswa-status/${id}`,
        {
          status: 'disetujui'
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );

      toast.success('Perizinan disetujui');
      fetchData();
    } catch (err: any) {
      toast.error('Gagal setujui');
    }
  };

  const handleTolak = async (id: string) => {
    try {
      await api.patch(
        `perizinan-siswa-status/${id}`,
        {
          status: 'ditolak'
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      toast.success('Perizinan ditolak');
      fetchData();
    } catch (err: any) {
      toast.error('Gagal tolak');
    }
  };

  useEffect(() => {
    fetchData();
  }, [idKelas]);

  return (
    <div className=''>
      <h1 className='mb-4 text-xl font-semibold'>Daftar Perizinan Siswa</h1>
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
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className='text-center'>
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
            {data.map((izin, idx) => (
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
                  })}{' '}
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
                    <a
                      href={izin.bukti}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      Lihat
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className='flex gap-2'>
                  <Button
                    size='sm'
                    className='bg-green-600 text-white hover:bg-green-700'
                    onClick={() => handleSetujui(izin.id)}
                  >
                    Setujui
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleTolak(izin.id)}
                  >
                    Tolak
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
