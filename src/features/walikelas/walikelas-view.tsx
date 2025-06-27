'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PengumumanKelas from './pengumuman-kelas';
import CatatanPerkembanganSiswa from './perkembangan-siswa';

type Student = {
  id: number;
  name: string;
  isPresent?: boolean;
  isIzin?: boolean;
  jamHadir?: string;
  tanggalIzin?: string; // YYYY-MM-DD
};

type IDKelas = {
  id: string;
};

interface Izin {
  id: number;
  studentId: number;
  studentName: string;
  tanggal: string;
  alasan: string;
}

const DashboardWaliKelas = ({ id }: IDKelas) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [masterStudents, setMasterStudents] = useState<Student[]>([]); // 🧠 Data semua siswa
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [matchedStudents, setMatchedStudents] = useState<Student[]>([]);
  const [izinList, setIzinList] = useState<Izin[]>([]);
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    // Dummy data izin, biasanya fetch dari API/backend
    const data: Izin[] = [
      {
        id: 1,
        studentId: 1,
        studentName: 'Ali',
        tanggal: '2025-06-19',
        alasan: 'Sakit demam'
      },
      {
        id: 2,
        studentId: 3,
        studentName: 'Citra',
        tanggal: '2025-06-19',
        alasan: 'Ada urusan keluarga'
      }
    ];
    setIzinList(data);
  }, []);

  useEffect(() => {
    const data: Student[] = [
      { id: 1, name: 'Ali' },
      { id: 2, name: 'Budi' },
      { id: 3, name: 'Citra' },
      { id: 4, name: 'Dewi' },
      { id: 5, name: 'Eka' }
    ];
    setMasterStudents(data);
    setStudents([data[0], data[1], data[2]]); // contoh siswa aktif
  }, []);

  useEffect(() => {
    if (!newStudentName.trim()) {
      setMatchedStudents([]);
      return;
    }

    const match = masterStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(newStudentName.trim().toLowerCase()) &&
        !students.some((st) => st.id === s.id) // hindari yang sudah ditambahkan
    );
    setMatchedStudents(match);
  }, [newStudentName, masterStudents, students]);

  useEffect(() => {
    const result = students
      .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    setFilteredStudents(result);
  }, [searchTerm, sortAsc, students]);

  const toggleAbsensi = (id: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isPresent: !s.isPresent,
              jamHadir: !s.isPresent
                ? new Date().toLocaleTimeString()
                : undefined
            }
          : s
      )
    );
  };

  const toggleIzin = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isIzin: !s.isIzin,
              tanggalIzin: !s.isIzin ? today : undefined,
              isPresent: false, // kalau izin, otomatis bukan hadir
              jamHadir: undefined
            }
          : s
      )
    );
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;

    const nameToFind = newStudentName.trim().toLowerCase();
    const studentInMaster = masterStudents.find(
      (s) => s.name.toLowerCase() === nameToFind
    );

    if (!studentInMaster) {
      alert('Siswa tidak ditemukan di data master.');
      return;
    }

    const alreadyExists = students.some((s) => s.id === studentInMaster.id);
    if (alreadyExists) {
      alert('Siswa sudah ditambahkan.');
      return;
    }

    setStudents([...students, studentInMaster]);
    setNewStudentName('');
  };

  const izinToday = students.filter(
    (s) => s.isIzin && s.tanggalIzin === new Date().toISOString().split('T')[0]
  );

  return (
    <div className='space-y-8 p-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>Dashboard Wali Kelas</h1>
        <div className='flex gap-2'>
          <Button variant='default'>Rekap Absensi</Button>
          <Button variant='default'>List Siswa</Button>
          <Button variant='default'>Cetak Kartu Ujian</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Tambah Siswa</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Input
              placeholder='Cari nama siswa...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full sm:w-auto'
            />
            <Button onClick={() => setSortAsc(!sortAsc)}>
              Sort: {sortAsc ? 'A-Z' : 'Z-A'}
            </Button>
          </div>

          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <Input
              placeholder='Nama siswa dari data'
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className='w-full sm:w-auto'
            />
          </div>

          {/* Hasil pencarian siswa */}
          {matchedStudents.length > 0 && (
            <div className='space-y-2 rounded-md border p-2'>
              {matchedStudents.map((student) => (
                <div
                  key={student.id}
                  className='flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0'
                >
                  <span>{student.name}</span>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      setStudents([...students, student]);
                      setNewStudentName('');
                      setMatchedStudents([]);
                    }}
                  >
                    Tambah
                  </Button>
                </div>
              ))}
            </div>
          )}
          {newStudentName && matchedStudents.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              Siswa tidak ditemukan
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Izin Siswa Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          {izinList.length === 0 ? (
            <p className='text-muted-foreground'>
              Belum ada pengajuan izin hari ini.
            </p>
          ) : (
            <ul className='list-disc space-y-2 pl-5'>
              {izinList.map((izin) => (
                <li key={izin.id}>
                  <strong>{izin.studentName}</strong> - {izin.alasan}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Absensi Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <table className='w-full border text-left'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='border p-2'>Nama</th>
              </tr>
            </thead>
            <tbody>
              <div className='space-y-4'>
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className='flex items-center justify-between rounded-md border p-2'
                  >
                    <div>
                      <p className='font-medium'>{student.name}</p>
                      {student.isPresent && (
                        <p className='text-sm text-green-600'>
                          Hadir - {student.jamHadir}
                        </p>
                      )}
                      {student.isIzin && (
                        <p className='text-sm text-yellow-600'>
                          Izin - {student.tanggalIzin}
                        </p>
                      )}
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        onClick={() => toggleAbsensi(student.id)}
                        variant='default'
                      >
                        {student.isPresent ? 'Batal Hadir' : 'Hadir'}
                      </Button>
                      <Button
                        onClick={() => toggleIzin(student.id)}
                        variant='outline'
                      >
                        {student.isIzin ? 'Batal Izin' : 'Izin'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <PengumumanKelas />

      <CatatanPerkembanganSiswa />
    </div>
  );
};

export default DashboardWaliKelas;
