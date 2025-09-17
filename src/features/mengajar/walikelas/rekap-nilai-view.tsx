'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { API } from '@/lib/server';
import api from '@/lib/api';

type NilaiRecord = {
  idSiswa: string;
  nis: string;
  nama: string;
  nilai: Record<string, number>;
  total: number;
};

interface RekapNilaiByKelasProps {
  idKelas: string;
}

export default function RekapNilaiTable({ idKelas }: RekapNilaiByKelasProps) {
  const [data, setData] = useState<NilaiRecord[]>([]);
  const [dynamicKeys, setDynamicKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`rekap-nilai-siswa/${idKelas}`);
      const json = await res.data;
      setData(json?.data);

      if (json?.data.length > 0) {
        setDynamicKeys(Object.keys(json.data[0].nilai));
      }
    };

    fetchData();
  }, [idKelas]);

  return (
    <div className='w-full overflow-x-auto rounded-lg p-4 shadow-sm'>
      <Table className='w-full overflow-x-auto'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>NIS</TableHead>
            <TableHead className='w-[20%]'>Nama</TableHead>
            {dynamicKeys.map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.idSiswa}>
                <TableCell>{row.nis}</TableCell>
                <TableCell>{row.nama}</TableCell>
                {dynamicKeys.map((key) => (
                  <TableCell key={key}>{row.nilai[key] ?? '-'}</TableCell>
                ))}
                <TableCell>{row.total}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={dynamicKeys.length + 3}
                className='text-center text-muted-foreground'
              >
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
