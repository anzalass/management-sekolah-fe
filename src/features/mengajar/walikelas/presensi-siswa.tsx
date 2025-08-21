import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { API } from '@/lib/server';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  const [dataKehadiran, setDataKehadiran] = useState<Kehadiran[]>();
  const { trigger, toggleTrigger } = useRenderTrigger();

  const getData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}kehadiran/hari-ini/${idKelas}`
      );

      setDataKehadiran(res.data.data);
    } catch (error) {
      toast.error('Gagal mendapatkan data');
    }
  };

  const toggleAbsensi = async (dataAbsen: Kehadiran, keterangan: string) => {
    try {
      if (dataAbsen.kehadiranSiswa.length > 0) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}kehadiran/${dataAbsen.kehadiranSiswa[0].id}`,
          {
            keterangan: keterangan
          }
        );
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}kehadiran`, {
          idSiswa: dataAbsen.id,
          namaSiswa: dataAbsen.nama,
          nisSiswa: dataAbsen.nis,
          idKelas: idKelas,
          keterangan: keterangan
        });
      }
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal absen');
    }
  };

  useEffect(() => {
    getData();
  }, [idKelas, trigger]);

  return (
    <Card className='w-full overflow-x-auto'>
      <CardHeader>
        <CardTitle>Absensi Hari Inii</CardTitle>
      </CardHeader>
      <div className='w-full overflow-x-auto rounded-lg p-5 shadow'>
        <table className='w-full border text-left text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border p-2'>Nama</th>
              <th className='border p-2'>Kehadiran</th>
              <th className='border p-2'>Keterangan</th>
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
                      className='shrink-0'
                      onClick={() => toggleAbsensi(student, 'Hadir')}
                    >
                      Hadir
                    </Button>
                    <Button
                      className='shrink-0'
                      onClick={() => toggleAbsensi(student, 'Izin')}
                      variant='outline'
                    >
                      Izin
                    </Button>
                    <Button
                      className='shrink-0'
                      onClick={() => toggleAbsensi(student, 'Sakit')}
                      variant='outline'
                    >
                      Sakit
                    </Button>
                    <Button
                      className='shrink-0'
                      onClick={() => toggleAbsensi(student, 'Tanpa Keterangan')}
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
