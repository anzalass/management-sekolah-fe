'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Siswa {
  id: number;
  name: string;
  nilai: Record<string, number>;
}

export default function InputNilaiKelas() {
  const [jenisPenilaian, setJenisPenilaian] = useState<string[]>([
    'Tugas 1',
    'UTS',
    'UAS'
  ]);
  const [penilaianBaru, setPenilaianBaru] = useState('');
  const [activePenilaian, setActivePenilaian] = useState('Tugas 1');

  const [siswaList, setSiswaList] = useState<Siswa[]>([
    { id: 1, name: 'Ali', nilai: {} },
    { id: 2, name: 'Budi', nilai: {} },
    { id: 3, name: 'Citra', nilai: {} },
    { id: 4, name: 'Dewi', nilai: {} }
  ]);

  const handleNilaiChange = (id: number, value: string) => {
    const angka = parseFloat(value);
    setSiswaList((prev) =>
      prev.map((siswa) =>
        siswa.id === id
          ? {
              ...siswa,
              nilai: {
                ...siswa.nilai,
                [activePenilaian]: isNaN(angka) ? 0 : angka
              }
            }
          : siswa
      )
    );
  };

  const handleTambahPenilaian = () => {
    if (!penilaianBaru.trim() || jenisPenilaian.includes(penilaianBaru)) return;
    setJenisPenilaian((prev) => [...prev, penilaianBaru]);
    setActivePenilaian(penilaianBaru);
    setPenilaianBaru('');
  };

  const handleSimpan = () => {
    console.log('Data nilai:', siswaList);
    alert('Nilai berhasil disimpan!');
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Input Nilai Kelas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Jenis Penilaian</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex flex-wrap gap-2'>
            {jenisPenilaian.map((jenis) => (
              <Button
                key={jenis}
                variant={jenis === activePenilaian ? 'default' : 'outline'}
                onClick={() => setActivePenilaian(jenis)}
              >
                {jenis}
              </Button>
            ))}
          </div>
          <div className='flex gap-2 pt-2'>
            <Input
              placeholder='Tambah jenis penilaian...'
              value={penilaianBaru}
              onChange={(e) => setPenilaianBaru(e.target.value)}
              className='w-[200px]'
            />
            <Button onClick={handleTambahPenilaian}>Tambah</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input Nilai: {activePenilaian}</CardTitle>
        </CardHeader>
        <CardContent>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-100 text-left'>
                <th className='border p-2'>No</th>
                <th className='border p-2'>Nama</th>
                <th className='border p-2'>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {siswaList.map((siswa, index) => (
                <tr key={siswa.id}>
                  <td className='border p-2'>{index + 1}</td>
                  <td className='border p-2'>{siswa.name}</td>
                  <td className='border p-2'>
                    <Input
                      type='number'
                      min={0}
                      max={100}
                      value={siswa.nilai[activePenilaian] ?? ''}
                      onChange={(e) =>
                        handleNilaiChange(siswa.id, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='mt-4 flex justify-end'>
            <Button onClick={handleSimpan}>Simpan Nilai</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
