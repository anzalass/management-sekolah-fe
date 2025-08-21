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

const today = new Date()
  .toLocaleDateString('id-ID', {
    weekday: 'long'
  })
  .toLowerCase();

type Props = {
  jadwalGuru: any[];
  fetchData: () => void;
};

export default function ListJadwalGuru({ jadwalGuru, fetchData }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setDateStr(formatter.format(new Date()));
  }, []);

  if (!dateStr) return null; // avoid SSR mismatch

  const jadwalHariIni = jadwalGuru.filter(
    (jadwal) => jadwal.hari?.toLowerCase() === today
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}jadwal-mengajar/delete/${id}`
      );
      toast.success('Jadwal berhasil dihapus');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus jadwal');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className='shadow-md'>
      <CardHeader className='flex flex-row items-center gap-2'>
        <Clock className='h-5 w-5 text-primary' />
        <CardTitle>Jadwal Hari Ini ({dateStr})</CardTitle>
      </CardHeader>
      <CardContent>
        {jadwalHariIni.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jam</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Ruang Kelas</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwalHariIni.map((jadwal, index) => (
                <TableRow key={index}>
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
