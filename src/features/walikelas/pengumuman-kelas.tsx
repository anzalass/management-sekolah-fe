'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Pengumuman {
  id: number;
  judul: string;
  tanggal: string;
  konten: string;
}

const PengumumanKelas = () => {
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [konten, setKonten] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!judul || !tanggal || !konten) return;

    if (editId) {
      // Edit existing
      setPengumumanList((prev) =>
        prev.map((p) =>
          p.id === editId ? { ...p, judul, tanggal, konten } : p
        )
      );
      setEditId(null);
    } else {
      // Add new
      const newItem: Pengumuman = {
        id: Date.now(),
        judul,
        tanggal,
        konten
      };
      setPengumumanList((prev) => [...prev, newItem]);
    }

    setJudul('');
    setTanggal('');
    setKonten('');
  };

  const handleEdit = (id: number) => {
    const item = pengumumanList.find((p) => p.id === id);
    if (!item) return;
    setJudul(item.judul);
    setTanggal(item.tanggal);
    setKonten(item.konten);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    setPengumumanList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengumuman Kelas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
        {/* Form */}
        <div className='space-y-6'>
          <Input
            placeholder='Judul Pengumuman'
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />
          <Input
            type='date'
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
          <Textarea
            placeholder='Isi pengumuman...'
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
          />
          <Button onClick={handleSubmit} className='mt-10'>
            {editId ? 'Update Pengumuman' : 'Tambah Pengumuman'}
          </Button>
        </div>

        {/* List */}
        {pengumumanList.length === 0 ? (
          <p className='text-sm text-muted-foreground'>Belum ada pengumuman.</p>
        ) : (
          <ul className='space-y-4'>
            {pengumumanList.map((p) => (
              <li key={p.id} className='rounded-md border p-3 shadow-sm'>
                <div className='mb-1 flex items-start justify-between'>
                  <div>
                    <h3 className='font-semibold'>{p.judul}</h3>
                    <span className='text-xs text-gray-500'>
                      {format(new Date(p.tanggal), 'dd MMMM yyyy')}
                    </span>
                  </div>
                  <div className='flex gap-2'>
                    <Button size='sm' onClick={() => handleEdit(p.id)}>
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDelete(p.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
                <p className='text-sm text-gray-700'>{p.konten}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default PengumumanKelas;
