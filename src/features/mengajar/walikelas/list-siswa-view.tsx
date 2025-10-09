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
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
  idKelas: string;
};

export default function ListSiswaView({ idKelas }: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // 🔹 Fetch siswa dengan react-query
  const { data: siswa, isLoading } = useQuery({
    queryKey: ['siswa', idKelas],
    queryFn: async () => {
      const res = await api.get(`kelas-walikelas/siswa/${idKelas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data;
    },
    enabled: !!session?.user?.token
  });

  // 🔹 Mutation remove siswa
  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`kelas-walikelas/remove/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Siswa berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['siswa', idKelas] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal hapus siswa');
    }
  });

  // 🔹 Mutation toggle rapot
  const toggleRapotMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      await api.patch(
        `kelas-walikelas/terbit/${id}`,
        { value: value ? 'Terbit' : 'Belum Terbit' },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: (_, { value }) => {
      toast.success(value ? 'Rapot berhasil diterbitkan' : 'Rapot dibatalkan');
      queryClient.invalidateQueries({ queryKey: ['siswa', idKelas] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal update rapot');
    }
  });

  // 🔹 Filtering
  const filteredData =
    siswa?.filter((item: any) =>
      item.namaSiswa.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className='overflow-x-auto p-5'>
      {/* Search Input */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Cari siswa...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400'
        />
      </div>

      <Table className='w-full border'>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>NIS</TableHead>
            <TableHead>Rapot</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className='py-6 text-center'>
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className='py-6 text-center'>
                Tidak ada siswa
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item: any) => (
              <TableRow key={item.idSiswa} className='hover:bg-gray-50'>
                <TableCell>{item.namaSiswa}</TableCell>
                <TableCell>{item.nisSiswa}</TableCell>

                {/* Toggle rapot */}
                <TableCell>
                  <Switch
                    checked={item.rapotSiswa === 'Terbit'}
                    onCheckedChange={(value) =>
                      toggleRapotMutation.mutate({ id: item.id, value })
                    }
                  />
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => removeMutation.mutate(item.id)}
                    disabled={removeMutation.isPending}
                  >
                    {removeMutation.isPending ? '...' : 'Remove'}
                  </Button>
                  <Link
                    href={`/mengajar/walikelas/${idKelas}/rekap-absensi/${item.idSiswa}`}
                  >
                    <Button size='sm'>Detail Absen</Button>
                  </Link>
                  <Link
                    href={`/mengajar/walikelas/${idKelas}/list-siswa/${item.idSiswa}`}
                  >
                    <Button size='sm'>Rapot</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
