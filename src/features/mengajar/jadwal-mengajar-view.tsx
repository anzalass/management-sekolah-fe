'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Clock, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/lib/server';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import ModalTambahJadwal from './modal-tambah-jadwal';

export default function JadwalMengajarView() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: session } = useSession();
  const [dateStr, setDateStr] = useState('');
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [showJadwalModal, setShowJadwalModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(`jadwal-guru`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      // Urutan hari manual
      const hariOrder = [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu'
      ];

      // Sort berdasarkan hari & jamMulai
      const sortedData = res.data.data.sort((a: any, b: any) => {
        const dayDiff = hariOrder.indexOf(a.hari) - hariOrder.indexOf(b.hari);

        // Jika hari sama, urutkan berdasarkan jamMulai
        if (dayDiff === 0) {
          return a.jamMulai.localeCompare(b.jamMulai);
        }

        return dayDiff;
      });

      setJadwal(sortedData);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`jadwal-mengajar/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      toast.success('Jadwal berhasil dihapus');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className='shadow-md'>
      <ModalTambahJadwal
        fetchData={fetchData}
        openModal={showJadwalModal}
        setOpenModal={setShowJadwalModal}
      />
      <CardHeader className='flex flex-row items-center gap-2'>
        <Button variant='outline' onClick={() => setShowJadwalModal(true)}>
          Tambah Jadwal +
        </Button>
      </CardHeader>
      <CardContent>
        {jadwal.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Ruang Kelas</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwal.map((jadwal, index) => (
                <TableRow key={index}>
                  <TableCell>{jadwal.hari}</TableCell>

                  <TableCell>
                    {jadwal.jamMulai} - {jadwal.jamSelesai}
                  </TableCell>

                  <TableCell>{jadwal.kelas}</TableCell>
                  <TableCell>{jadwal.namaMapel}</TableCell>
                  <TableCell>{jadwal.ruang}</TableCell>
                  <TableCell>
                    <Button
                      variant='destructive'
                      size='sm'
                      disabled={deletingId === jadwal.id}
                      onClick={() => handleDelete(jadwal.id)}
                    >
                      {deletingId === jadwal.id ? (
                        <span className='text-xs'>Menghapus...</span>
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className='text-sm italic text-muted-foreground'>
            Tidak ada jadwal hari ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
