'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

type NilaiDetail = {
  nilai: number;
  bobot: number;
};

type NilaiRecord = {
  namaKelas: string;
  data: {
    idSiswa: string;
    nis: string;
    nama: string;
    nilai: Record<string, NilaiDetail>;
    totalNilai: number;
    rataRata: number;
  }[];
};

interface RekapNilaiByKelasProps {
  idKelas: string;
}

export default function RekapNilaiTable({ idKelas }: RekapNilaiByKelasProps) {
  const { data: session } = useSession();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['rekap-nilai', idKelas],
    queryFn: async (): Promise<NilaiRecord> => {
      const res = await api.get(`rekap-nilai-siswa/${idKelas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      return res.data;
    },
    enabled: !!session?.user?.token
  });

  // Ambil semua key dari data pertama
  const dynamicKeys =
    data && data.data.length > 0 ? Object.keys(data.data[0].nilai) : [];

  if (isLoading)
    return (
      <div className='p-4 text-center text-muted-foreground'>
        Memuat data...
      </div>
    );

  if (isError)
    return (
      <div className='p-4 text-center text-red-500'>
        Gagal memuat data nilai.
      </div>
    );

  return (
    <div className='w-full rounded-lg p-4 shadow-sm'>
      <p className='mb-7 text-base font-bold md:text-lg'>
        Rekap Nilai - {data?.namaKelas}
      </p>
      <Table className='w-full overflow-x-auto'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>NIS</TableHead>
            <TableHead className='w-[20%]'>Nama</TableHead>

            {/* tampilkan nama + bobot di header */}
            {dynamicKeys.map((key) => {
              const bobot = data?.data?.[0]?.nilai?.[key]?.bobot ?? 0;
              return (
                <TableHead key={key} className='text-center capitalize'>
                  {key} ({bobot}%)
                </TableHead>
              );
            })}

            <TableHead className='text-center'>Total Nilai</TableHead>
            <TableHead className='text-center'>Rata-Rata</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data && data.data.length > 0 ? (
            data.data.map((row) => (
              <TableRow key={row.idSiswa}>
                <TableCell>{row.nis}</TableCell>
                <TableCell>{row.nama}</TableCell>

                {dynamicKeys.map((key) => {
                  const nilaiObj = row.nilai[key];
                  return (
                    <TableCell key={key} className='text-center'>
                      {nilaiObj ? (
                        <>
                          {nilaiObj.nilai}
                          {nilaiObj.bobot === 0 && (
                            <span className='text-xs text-gray-400'>
                              {' '}
                              (bobot 0)
                            </span>
                          )}
                        </>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  );
                })}

                <TableCell className='text-center font-medium'>
                  {row.totalNilai}
                </TableCell>
                <TableCell className='text-center'>
                  {row.rataRata.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={dynamicKeys.length + 4}
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
