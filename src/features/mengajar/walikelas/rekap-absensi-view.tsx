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
import { Notebook } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

interface RekapAbsensi {
  idSiswa: string | null;
  nisSiswa: string;
  namaSiswa: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  total: number;
}

interface RekapAbsensiByKelasProps {
  idKelas: string;
}

export default function RekapAbsensiByKelasView({
  idKelas
}: RekapAbsensiByKelasProps) {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');

  // fetch data pakai react-query
  const {
    data: rekap = [],
    isLoading,
    isError,
    error
  } = useQuery<RekapAbsensi[]>({
    queryKey: ['rekap-absensi', idKelas],
    queryFn: async () => {
      try {
        const res = await api.get(`rekap-absensi/${idKelas}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return res.data;
      } catch (err: any) {
        throw new Error(
          err?.response?.data?.message || 'Gagal memuat data rekap absensi'
        );
      }
    },
    enabled: !!idKelas // hanya jalan kalau idKelas ada
  });

  // filter nama
  const filteredData = rekap.filter((item) =>
    item.namaSiswa.toLowerCase().includes(search.toLowerCase())
  );

  // error toast (bisa juga di onError)
  if (isError) {
    toast.error((error as Error).message);
  }

  return (
    <div className='space-y-4 p-4'>
      {/* Search */}
      <div className='flex w-full items-center justify-between gap-2'>
        <h2 className='text-xl font-semibold'>Rekap Absensi Kelas</h2>
        <Input
          placeholder='Cari nama siswa...'
          value={search}
          className='w-[30%]'
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Table className='overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
            <TableHeader>
              <TableRow className='bg-gray-100'>
                <TableHead className='font-bold text-gray-700'>
                  Nama Siswa
                </TableHead>
                <TableHead className='font-bold text-gray-700'>NIS</TableHead>
                <TableHead className='font-bold text-gray-700'>Hadir</TableHead>
                <TableHead className='font-bold text-gray-700'>Izin</TableHead>
                <TableHead className='font-bold text-gray-700'>Sakit</TableHead>
                <TableHead className='font-bold text-gray-700'>Alpa</TableHead>
                <TableHead className='font-bold text-gray-700'>Total</TableHead>
                <TableHead className='font-bold text-gray-700'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='py-4 text-center'>
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow
                    key={item.idSiswa || item.nisSiswa}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <TableCell>{item.namaSiswa}</TableCell>
                    <TableCell>{item.nisSiswa}</TableCell>
                    <TableCell>{item.hadir}</TableCell>
                    <TableCell>{item.izin}</TableCell>
                    <TableCell>{item.sakit}</TableCell>
                    <TableCell>{item.alpa}</TableCell>
                    <TableCell className='font-semibold text-gray-800'>
                      {item.total}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/mengajar/walikelas/${idKelas}/rekap-absensi/${item.idSiswa}`}
                      >
                        <Notebook size={16} color='blue' />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
