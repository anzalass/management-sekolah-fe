import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import React from 'react';

type Props = {
  setOpenModal: (val: string | null) => void;
  kelasWaliKelas: any[];
  kelasMapel: any[];
};

export default function ListKelasGuru({
  setOpenModal,
  kelasWaliKelas,
  kelasMapel
}: Props) {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {/* Wali Kelas */}
      <Card className='shadow-md'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <GraduationCap className='h-5 w-5 text-primary' />
              <CardTitle className='text-lg font-semibold'>
                Wali Kelas
              </CardTitle>
            </div>
            <Button
              size='sm'
              variant='default'
              onClick={() => setOpenModal('kelas')}
            >
              Tambah Kelas
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {kelasWaliKelas.map((kelas, idx) => (
            <div
              key={idx}
              className='cursor-pointer rounded-xl border border-muted p-5 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md'
              onClick={() => console.log('Klik wali kelas', kelas.id)}
            >
              <div className='mb-1 text-base font-semibold'>{kelas.nama}</div>
              <div className='text-sm text-muted-foreground'>
                Tahun Ajaran:{' '}
                <span className='font-medium'>{kelas.tahunAjaran}</span>
              </div>
              <div className='mt-2 flex items-center text-sm text-muted-foreground'>
                <Users className='mr-1 h-4 w-4 text-muted-foreground' />
                {kelas.jumlahSiswa} siswa
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Kelas Diajar */}
      <Card className='shadow-md'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5 text-primary' />
              <CardTitle className='text-lg font-semibold'>
                Mengajar di Kelas
              </CardTitle>
            </div>
            <Button
              size='sm'
              variant='default'
              onClick={() => setOpenModal('mapel')}
            >
              Tambah Kelas Mapel
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {kelasMapel.map((item, idx) => (
            <div
              key={idx}
              onClick={() => console.log('Klik kelas diajar', item.kelas)}
              className='cursor-pointer rounded-xl border border-muted p-5 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md'
            >
              <div className='mb-1 text-base font-semibold'>
                {item.namaMapel}
              </div>
              <div className='text-sm text-muted-foreground'>
                Kelas: <span className='font-medium'>{item.kelas}</span>
              </div>
              <div className='mt-2 flex items-center text-sm text-muted-foreground'>
                <Users className='mr-1 h-4 w-4 text-muted-foreground' />
                {item.jumlahSiswa} siswa
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
