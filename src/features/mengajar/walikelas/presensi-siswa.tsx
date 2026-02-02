'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

type IDKelas = {
  idKelas: string;
};

type DetailKehadiran = {
  id: string;
  nisSiswa: string;
  idKelas: string;
  waktu: string;
  keterangan: string;
};

type Kehadiran = {
  id: string;
  nis: string;
  nama: string;
  kehadiranSiswa: DetailKehadiran[];
};

export default function PresensiSiswa({ idKelas }: IDKelas) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // 🔥 loading per siswa (INI PENTING)
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  // ======================
  // GET DATA
  // ======================
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

  // ======================
  // MUTATION
  // ======================
  const mutation = useMutation({
    mutationFn: async ({
      dataAbsen,
      keterangan
    }: {
      dataAbsen: Kehadiran;
      keterangan: string;
    }) => {
      setLoadingId(dataAbsen.id);

      // UPDATE
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
      }

      // CREATE
      return api.post(
        `kehadiran`,
        {
          idSiswa: dataAbsen.id,
          namaSiswa: dataAbsen.nama,
          nisSiswa: dataAbsen.nis,
          idKelas,
          keterangan
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
    },

    onSuccess: async () => {
      toast.success('Absensi berhasil disimpan');

      // ⬇️ WAJIB await biar mobile stabil
      await queryClient.invalidateQueries({
        queryKey: ['kehadiran', idKelas]
      });

      setLoadingId(null);
    },

    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
      setLoadingId(null);
    }
  });

  const { mutate } = mutation;

  const formatKeterangan = (keterangan?: string) => {
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

  // ======================
  // LOADING STATE
  // ======================
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

  // ======================
  // UI
  // ======================
  return (
    <Card className='w-full overflow-x-auto'>
      <CardHeader>
        <CardTitle className='text-base'>Absensi Hari Ini</CardTitle>
      </CardHeader>

      <div className='w-full overflow-x-auto p-5'>
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
              const detail = student.kehadiranSiswa[0];

              return (
                <tr key={student.id} className='border-b align-top'>
                  <td className='p-2'>{student.nama}</td>

                  <td className='p-2'>
                    {formatKeterangan(detail?.keterangan)}
                  </td>

                  <td className='p-2'>
                    {detail?.waktu
                      ? new Date(detail.waktu).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'}
                  </td>

                  <td className='p-2'>
                    <div className='flex flex-wrap gap-2'>
                      {['Hadir', 'Izin', 'Sakit', 'TanpaKeterangan'].map(
                        (status) => (
                          <Button
                            key={status}
                            variant='outline'
                            disabled={loadingId === student.id}
                            onClick={() =>
                              mutate({ dataAbsen: student, keterangan: status })
                            }
                          >
                            {loadingId === student.id ? (
                              <Loader2 className='h-4 w-4 animate-spin' />
                            ) : status === 'TanpaKeterangan' ? (
                              'Tanpa Ket.'
                            ) : (
                              status
                            )}
                          </Button>
                        )
                      )}
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
