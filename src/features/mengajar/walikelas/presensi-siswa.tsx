'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type IDKelas = {
  idKelas: string;
};

type Kehadiran = {
  id: string;
  nis: string;
  nama: string;
  kehadiranSiswa: DetailKehadiran[];
};

type DetailKehadiran = {
  id: string;
  nisSiswa: string;
  idKelas: string;
  waktu: string;
  keterangan: string;
};

export default function PresensiSiswa({ idKelas }: IDKelas) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // ✅ Fetch data dengan react-query
  const { data: dataKehadiran, isLoading } = useQuery<Kehadiran[]>({
    queryKey: ['kehadiran', idKelas],
    queryFn: async () => {
      const res = await api.get(`kehadiran/hari-ini/${idKelas}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token // jangan fetch sebelum token ready
  });

  // ✅ Mutation untuk absen (create/update)
  const mutation = useMutation({
    mutationFn: async ({
      dataAbsen,
      keterangan
    }: {
      dataAbsen: Kehadiran;
      keterangan: string;
    }) => {
      if (dataAbsen.kehadiranSiswa.length > 0) {
        // update
        return api.put(
          `kehadiran/${dataAbsen.kehadiranSiswa[0].id}`,
          { keterangan },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
      } else {
        // create
        return api.post(
          `kehadiran`,
          {
            idSiswa: dataAbsen.id,
            namaSiswa: dataAbsen.nama,
            nisSiswa: dataAbsen.nis,
            idKelas: idKelas,
            keterangan
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
      }
    },
    onSuccess: () => {
      toast.success('Absensi berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['kehadiran', idKelas] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Card className='w-full overflow-x-auto'>
      <CardHeader>
        <CardTitle className='text-base'>Absensi Hari Ini</CardTitle>
      </CardHeader>
      <div className='w-full overflow-x-auto rounded-lg p-5 shadow'>
        <table className='w-full border text-left text-sm'>
          <thead>
            <tr>
              <th className='border p-2'>Nama</th>
              <th className='border p-2'>Kehadiran</th>
              <th className='border p-2'>Waktu</th>
              <th className='border p-2'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKehadiran?.map((student) => (
              <tr key={student.nis} className='border-b align-top'>
                <td className='p-2'>{student.nama}</td>
                <td className='p-2'>
                  {student.kehadiranSiswa?.length > 0
                    ? student.kehadiranSiswa[0]?.keterangan
                    : 'Belum Absen'}
                </td>
                <td className='p-2'>
                  {student.kehadiranSiswa?.length > 0
                    ? new Date(
                        student.kehadiranSiswa[0]?.waktu
                      ).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'}
                </td>
                <td className='p-2'>
                  <div className='flex gap-2 overflow-x-auto whitespace-nowrap pb-2'>
                    <Button
                      className='shrink-0 bg-green-500'
                      onClick={() =>
                        mutation.mutate({
                          dataAbsen: student,
                          keterangan: 'Hadir'
                        })
                      }
                    >
                      Hadir
                    </Button>
                    <Button
                      className='shrink-0 bg-yellow-500'
                      onClick={() =>
                        mutation.mutate({
                          dataAbsen: student,
                          keterangan: 'Izin'
                        })
                      }
                      variant='outline'
                    >
                      Izin
                    </Button>
                    <Button
                      className='shrink-0 bg-blue-500'
                      onClick={() =>
                        mutation.mutate({
                          dataAbsen: student,
                          keterangan: 'Sakit'
                        })
                      }
                      variant='outline'
                    >
                      Sakit
                    </Button>
                    <Button
                      className='shrink-0 bg-red-500'
                      onClick={() =>
                        mutation.mutate({
                          dataAbsen: student,
                          keterangan: 'Tanpa Keterangan'
                        })
                      }
                      variant='outline'
                    >
                      Tanpa Keterangan
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
