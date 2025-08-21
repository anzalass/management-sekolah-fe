'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { API } from '@/lib/server';
import { Card } from '@/components/ui/card';
import { Eye, FileText, Notebook } from 'lucide-react';

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
  const [data, setData] = useState<RekapAbsensi[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}rekap-absensi/${idKelas}`
        );
        setData(res.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchRekap();
  }, [idKelas]);

  return (
    <div className='p-4'>
      <h2 className='mb-4 text-xl font-semibold'>Rekap Absensi Kelas</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Card className='p-5'>
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
              {data.map((item) => (
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
                    <Notebook size={16} color='blue' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
