'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react'; // ✅ Spinner dari Lucide

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
    enabled: !!session?.user?.token
  });

  // ✅ Ambil isPending untuk loading
  const mutation = useMutation({
    mutationFn: async ({
      dataAbsen,
      keterangan
    }: {
      dataAbsen: Kehadiran;
      keterangan: string;
    }) => {
      if (dataAbsen.kehadiranSiswa.length > 0) {
        return api.put(
          `kehadiran/${dataAbsen.kehadiranSiswa[0].id}`,
          { keterangan },
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
      } else {
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

  const { mutate, isPending } = mutation; // ✅ gunakan isPending

  const formatKeterangan = (keterangan: string) => {
    switch (keterangan) {
      case 'Hadir':
        return 'Hadir';
      case 'Izin':
        return 'Izin';
      case 'Sakit':
        return 'Sakit';
      case 'TanpaKeterangan':
        return 'Tanpa Keterangan';
      default:
        return 'Belum Absen';
    }
  };

  if (isLoading) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-base'>Absensi Hari Ini</CardTitle>
        </CardHeader>
        <div className='p-5 text-center'>
          <Loader2 className='mx-auto h-6 w-6 animate-spin text-muted-foreground' />
          <p className='mt-2 text-sm text-muted-foreground'>Memuat data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='w-full overflow-x-auto'>
      <CardHeader>
        <CardTitle className='text-base'>Absensi Hari Ini</CardTitle>
      </CardHeader>
      <div className='w-full overflow-x-auto rounded-lg p-5 shadow'>
        <table className='w-full min-w-[500px] border text-left text-sm'>
          <thead>
            <tr>
              <th className='border p-2'>Nama</th>
              <th className='border p-2'>Kehadiran</th>
              <th className='border p-2'>Waktu</th>
              <th className='border p-2'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKehadiran?.map((student) => {
              const sudahAbsen = student.kehadiranSiswa.length > 0;
              return (
                <tr key={student.nis} className='border-b align-top'>
                  <td className='p-2'>{student.nama}</td>
                  <td className='p-2'>
                    {sudahAbsen
                      ? formatKeterangan(student.kehadiranSiswa[0]?.keterangan)
                      : 'Belum Absen'}
                  </td>
                  <td className='p-2'>
                    {sudahAbsen
                      ? new Date(
                          student.kehadiranSiswa[0]?.waktu
                        ).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'}
                  </td>
                  <td className='p-2'>
                    <div className='flex flex-wrap gap-2'>
                      <Button
                        variant={sudahAbsen ? 'outline' : 'default'}
                        className={`shrink-0 ${
                          sudahAbsen
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-green-500'
                        }`}
                        onClick={() =>
                          mutate({ dataAbsen: student, keterangan: 'Hadir' })
                        }
                        disabled={isPending} // ✅ disable saat loading atau sudah absen
                      >
                        {isPending ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          'Hadir'
                        )}
                      </Button>

                      <Button
                        variant='outline'
                        className='shrink-0 border-yellow-500 text-yellow-500 hover:bg-yellow-50'
                        onClick={() =>
                          mutate({ dataAbsen: student, keterangan: 'Izin' })
                        }
                        disabled={isPending} // ✅
                      >
                        {isPending ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          'Izin'
                        )}
                      </Button>

                      <Button
                        variant='outline'
                        className='shrink-0 border-blue-500 text-blue-500 hover:bg-blue-50'
                        onClick={() =>
                          mutate({ dataAbsen: student, keterangan: 'Sakit' })
                        }
                        disabled={isPending} // ✅
                      >
                        {isPending ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          'Sakit'
                        )}
                      </Button>

                      <Button
                        variant='outline'
                        className='shrink-0 border-red-500 text-red-500 hover:bg-red-50'
                        onClick={() =>
                          mutate({
                            dataAbsen: student,
                            keterangan: 'TanpaKeterangan'
                          })
                        }
                        disabled={isPending} // ✅
                      >
                        {isPending ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          'Tanpa Keterangan'
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
