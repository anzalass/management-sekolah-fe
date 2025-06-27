'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Student {
  id: number;
  name: string;
}

interface CatatanPerkembangan {
  id: number;
  studentId: number;
  studentName: string;
  keterangan: string;
}

const CatatanPerkembanganSiswa = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [keterangan, setKeterangan] = useState('');
  const [catatanList, setCatatanList] = useState<CatatanPerkembangan[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    // Simulasi data siswa di kelas
    setStudents([
      { id: 1, name: 'Ali' },
      { id: 2, name: 'Budi' },
      { id: 3, name: 'Citra' }
    ]);
  }, []);

  const handleSubmit = () => {
    if (!selectedStudentId || !keterangan.trim()) return;

    const student = students.find((s) => s.id === Number(selectedStudentId));
    if (!student) return;

    if (editId) {
      setCatatanList((prev) =>
        prev.map((c) =>
          c.id === editId
            ? {
                ...c,
                studentId: student.id,
                studentName: student.name,
                keterangan
              }
            : c
        )
      );
      setEditId(null);
    } else {
      const newCatatan: CatatanPerkembangan = {
        id: Date.now(),
        studentId: student.id,
        studentName: student.name,
        keterangan: keterangan.trim()
      };
      setCatatanList((prev) => [...prev, newCatatan]);
    }

    setSelectedStudentId('');
    setKeterangan('');
  };

  const handleEdit = (id: number) => {
    const catatan = catatanList.find((c) => c.id === id);
    if (!catatan) return;
    setSelectedStudentId(catatan.studentId.toString());
    setKeterangan(catatan.keterangan);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    setCatatanList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catatan Perkembangan Siswa</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Form */}
        <div className='space-y-2'>
          <Select
            value={selectedStudentId}
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Pilih siswa' />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder='Tulis catatan perkembangan...'
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          />

          <Button onClick={handleSubmit}>
            {editId ? 'Update Catatan' : 'Tambah Catatan'}
          </Button>
        </div>

        {/* List */}
        {catatanList.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            Belum ada catatan perkembangan.
          </p>
        ) : (
          <ul className='mt-4 space-y-3'>
            {catatanList.map((c) => (
              <li key={c.id} className='rounded-md border p-3 shadow-sm'>
                <div className='mb-1 flex items-start justify-between'>
                  <div>
                    <h4 className='font-semibold'>{c.studentName}</h4>
                    <p className='whitespace-pre-line text-sm text-gray-700'>
                      {c.keterangan}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <Button size='sm' onClick={() => handleEdit(c.id)}>
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDelete(c.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CatatanPerkembanganSiswa;
