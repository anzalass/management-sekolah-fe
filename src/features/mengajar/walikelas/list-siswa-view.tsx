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
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { Switch } from '@/components/ui/switch';

type Props = {
  idKelas: String;
};

export default function ListSiswaView({ idKelas }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const { data: session } = useSession();

  const getSiswa = async () => {
    try {
      const response2 = await api.get(`kelas-walikelas/siswa/${idKelas}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setData(response2?.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getSiswa();
  }, [idKelas]);

  // Filter data berdasarkan namaSiswa
  const filteredData = data.filter((item: any) =>
    item.namaSiswa.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`kelas-walikelas/remove/${id}`);
      setData((prev) => prev.filter((s) => s.idSiswa !== id));
      toast.success('Siswa berhasil dihapus');
      getSiswa();
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleToggleRapot = async (id: string, value: boolean) => {
    try {
      await api.patch(
        `kelas-walikelas/terbit/${id}`,
        { value: value ? 'Terbit' : 'Belum Terbit' },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );

      setData((prev) =>
        prev.map((s) => (s.idSiswa === id ? { ...s, rapotTerbit: value } : s))
      );
      getSiswa();
      toast.success(value ? 'Rapot berhasil diterbitkan' : 'Rapot dibatalkan');
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

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
          {filteredData.length === 0 ? (
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
                    checked={item.rapotSiswa === 'Terbit' ? true : false}
                    onCheckedChange={(value) =>
                      handleToggleRapot(item.id, value)
                    }
                  />
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
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
