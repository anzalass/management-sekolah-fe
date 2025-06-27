import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Clock } from 'lucide-react';
import React from 'react';

const hariIniLabel = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const today = new Date()
  .toLocaleDateString('id-ID', {
    weekday: 'long'
  })
  .toLowerCase();

type Props = {
  jadwalGuru: any[];
};

export default function ListJadwalGuru({ jadwalGuru }: Props) {
  const jadwalHariIni = jadwalGuru.filter(
    (jadwal) => jadwal.hari?.toLowerCase() === today
  );

  return (
    <Card className='shadow-md'>
      <CardHeader className='flex flex-row items-center gap-2'>
        <Clock className='h-5 w-5 text-primary' />
        <CardTitle>Jadwal Hari Ini ({hariIniLabel})</CardTitle>
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
