'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import api from '@/lib/api';
import { toast } from 'sonner';

type Props = {
  idSiswa: string;
  idKelas: string;
};

export default function RapotView({ idSiswa, idKelas }: Props) {
  const [tahunAjaran, setTahunAjaran] = useState('');
  const [data, setData] = useState<any>();
  const getTahunAjaran = async () => {
    try {
      const res = await api.get(`kelas-walikelas/get/${idKelas}`);
      console.log(res.data.tahunAjaran);
      setTahunAjaran(res.data.tahunAjaran);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTahunAjaran();
  }, [idKelas]);

  const getData = async () => {
    try {
      const res = await api.get(
        `rapot2?idKelas=${idKelas}&idSiswa=${idSiswa}&tahunAjaran=${tahunAjaran}`
      );
      setData(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getData();
  }, [tahunAjaran !== '']);

  return (
    <div className='mx-auto w-full space-y-6 p-5'>
      {/* Header Sekolah */}
      <div className='space-y-1 text-center'>
        <h1 className='text-xl font-bold'>Laporan Hasil Belajar</h1>{' '}
        <p className='font-semibold'>Yayasan Tunas Anak Mulia</p>
      </div>

      {/* Info Siswa */}
      <Card>
        <CardHeader>
          <CardTitle>Data Siswa</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold'>Nama:</p>
            <p>{data?.siswa?.nama}</p>
          </div>
          <div>
            <p className='font-semibold'>NIS:</p>
            <p>{data?.siswa?.nis}</p>
          </div>
          <div>
            <p className='font-semibold'>Kelas:</p>
            <p>{data?.siswa?.kelas}</p>
          </div>
          <div>
            <p className='font-semibold'>ID Siswa:</p>
            <p>{data?.siswa?.id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Nilai Mata Pelajaran */}
      <Card>
        <CardHeader>
          <CardTitle>Nilai Mata Pelajaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-1/2'>Mata Pelajaran</TableHead>
                <TableHead className='w-1/4'>Guru</TableHead>
                <TableHead className='w-1/4'>Nilai Akhir</TableHead>
                <TableHead className='w-1/4'>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.nilai?.map((item: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>{item?.mapel}</TableCell>
                  <TableCell>{item?.guru}</TableCell>
                  <TableCell>{item?.nilaiAkhir ?? '-'}</TableCell>
                  <TableCell>{item?.catatanAkhir ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rekap Absensi */}
      <Card>
        <CardHeader>
          <CardTitle>Rekap Absensi</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-5 gap-4 text-center'>
          <div className='rounded border p-2'>
            <p className='font-semibold'>Total Hari</p>
            <p>{data?.absensi?.total}</p>
          </div>
          <div className='rounded border p-2'>
            <p className='font-semibold'>Hadir</p>
            <p>{data?.absensi?.hadir}</p>
          </div>
          <div className='rounded border p-2'>
            <p className='font-semibold'>Izin</p>
            <p>{data?.absensi?.izin}</p>
          </div>
          <div className='rounded border p-2'>
            <p className='font-semibold'>Sakit</p>
            <p>{data?.absensi?.sakit}</p>
          </div>
          <div className='rounded border p-2'>
            <p className='font-semibold'>Alpha</p>
            <p>{data?.absensi?.alpha}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tanda Tangan */}
      <div className='mt-10 grid grid-cols-2 gap-8'>
        <div className='text-center'>
          <p className='font-semibold'>Wali Kelas</p>
          <div className='mt-8 h-20 border-b'></div>
        </div>
        <div className='text-center'>
          <p className='font-semibold'>Kepala Sekolah</p>
          <div className='mt-8 h-20 border-b'></div>
          {/* <p className='mt-2'>{sekolah.kepalaSekolah}</p> */}
        </div>
      </div>
    </div>
  );
}
