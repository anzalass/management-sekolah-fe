'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MateriSection from './tambah-materi-kelas';
import InputNilaiKelas from './input-nilai-kelas';
import ModalMateri from './tambah-materi-kelas';
import { Trash2 } from 'lucide-react';
import ModalTugas from './tambah-tugas';
import { API } from '@/lib/server';
import axios from 'axios';
import { toast } from 'sonner';

interface Student {
  id: number;
  name: string;
  nis?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  kelas?: string;
}

interface Materi {
  id: number;
  judul: string;
  konten: string;
  deadline: string;
}

interface Tugas {
  id: number;
  judul: string;
  deskripsi: string;
  deadline: string;
}

type KelasMapelID = {
  id: string;
};

export default function KelasMapelView({ id }: KelasMapelID) {
  const [masterSiswa, setMasterSiswa] = useState<Student[]>([]);
  const [kelasSiswa, setKelasSiswa] = useState<Student[]>([]);
  const [selectedSiswaId, setSelectedSiswaId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTugasModal, setShowTugasModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMasterSiswa, setFilteredMasterSiswa] = useState<Student[]>([]);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await axios.get(`${API}user/get-all-siswa`);
        const json = response.data;

        if (Array.isArray(json.result?.data)) {
          const siswaArray: Student[] = json.result.data.map((item: any) => ({
            id: item.id,
            name: item.nama,
            nis: item.nis,
            gender: item.jenisKelamin,
            kelas: item.kelas
          }));

          setMasterSiswa(siswaArray);
        } else {
          console.error('Data siswa bukan array:', json.result?.data);
        }
      } catch (error) {
        console.error('Gagal fetch siswa:', error);
      }
    };

    fetchSiswa();
  }, []);

  useEffect(() => {
    const filtered = masterSiswa.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !kelasSiswa.find((k) => k.id === s.id) // jangan tampilkan yg sudah masuk kelas
    );
    setFilteredMasterSiswa(filtered);
  }, [searchTerm, masterSiswa, kelasSiswa]);

  const [judulMateri, setJudulMateri] = useState('');
  const [kontenMateri, setKontenMateri] = useState('');

  const [materiList, setMateriList] = useState<Materi[]>([
    {
      id: 1,
      judul: 'Pengantar Algoritma',
      konten:
        'Materi ini membahas konsep dasar algoritma dan logika pemrograman.',
      deadline: '2025-06-25'
    },
    {
      id: 2,
      judul: 'Struktur Data Dasar',
      konten: 'Materi ini menjelaskan tentang array, linked list, dan stack.',
      deadline: '2025-06-25'
    },
    {
      id: 3,
      judul: 'Pemrograman Berbasis Objek',
      konten:
        'Materi mengenai konsep OOP seperti inheritance, encapsulation, dan polymorphism.',
      deadline: '2025-06-25'
    }
  ]);

  const [tugasList, setTugasList] = useState<Tugas[]>([
    {
      id: 1,
      judul: 'Tugas 1: Flowchart',
      deskripsi: 'Buatlah flowchart sederhana tentang proses login aplikasi.',
      deadline: '2025-06-25'
    },
    {
      id: 2,
      judul: 'Tugas 2: Implementasi Array',
      deskripsi:
        'Buatlah program sederhana untuk menyimpan dan menampilkan data mahasiswa menggunakan array.',
      deadline: '2025-06-25'
    },
    {
      id: 3,
      judul: 'Tugas 3: Studi Kasus OOP',
      deskripsi:
        'Buat program tentang manajemen perpustakaan dengan konsep OOP.',
      deadline: '2025-06-25'
    }
  ]);
  const [judulTugas, setJudulTugas] = useState('');
  const [deskripsiTugas, setDeskripsiTugas] = useState('');

  const handleAddSiswaToKelas = async (nis: string) => {
    try {
      const response = await axios.post(`${API}kelas-mapel/add-siswa`, {
        nis,
        idKelas: id // pastikan juga kirim ID kelasMapel
      });

      toast.success('Siswa berhasil ditambahkan ke kelas');
      const siswa = masterSiswa.find((s) => s.nis === nis);
      if (siswa) {
        setKelasSiswa((prev) => [...prev, siswa]);
        setSearchTerm('');
      }
    } catch (error) {
      console.error('Gagal menambahkan siswa:', error);
      toast.error('Gagal menambahkan siswa ke kelas');
    }
  };

  const handleAddMateri = () => {
    if (!judulMateri || !kontenMateri) return;
    const newMateri: Materi = {
      id: Date.now(),
      judul: judulMateri,
      konten: kontenMateri,
      deadline: ''
    };
    setMateriList((prev) => [...prev, newMateri]);
    setJudulMateri('');
    setKontenMateri('');
  };

  const handleAddTugas = () => {
    if (!judulTugas || !deskripsiTugas) return;
    const newTugas: Tugas = {
      id: Date.now(),
      judul: judulTugas,
      deskripsi: deskripsiTugas,
      deadline: ''
    };
    setTugasList((prev) => [...prev, newTugas]);
    setJudulTugas('');
    setDeskripsiTugas('');
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard Kelas Mapel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Siswa ke Kelas</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Input
            placeholder='Cari nama siswa...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm.trim() !== '' && filteredMasterSiswa.length > 0 && (
            <div className='rounded border p-2'>
              <ul className='space-y-1'>
                {filteredMasterSiswa.map((siswa) => (
                  <li
                    key={siswa.id}
                    className='flex items-center justify-between border-b pb-1 last:border-none last:pb-0'
                  >
                    <span>
                      {siswa.name} - {siswa.nis}
                    </span>
                    <Button
                      size='sm'
                      onClick={() => handleAddSiswaToKelas(siswa.nis || '')}
                    >
                      Tambah
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa di Kelas Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='ml-5 list-disc'>
            {kelasSiswa.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className='flex space-x-2'>
        <Button onClick={() => setShowModal(true)}>Tambah Materi +</Button>
        <Button onClick={() => setShowModal(true)}>Tambah Tugas +</Button>
        <Button onClick={() => setShowModal(true)}>Tambah Ujian +</Button>
      </div>

      <ModalMateri open={showModal} onOpenChange={setShowModal} />
      <ModalTugas open={showTugasModal} onOpenChange={setShowTugasModal} />

      <div>
        <h4 className='text-md mb-2 font-semibold'>Daftar Materi</h4>
        {materiList.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            Belum ada materi ditambahkan.
          </p>
        )}

        <div className='space-y-3'>
          {materiList.map((materi) => (
            <Card key={materi.id} className='relative cursor-pointer p-4'>
              <button className='absolute right-2 top-2 text-gray-500 hover:text-red-500'>
                <Trash2 size={16} />
              </button>
              <p className='font-semibold'>{materi.judul}</p>
              <p className='text-sm text-muted-foreground'>{materi.konten}</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                {materi.deadline}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4 className='text-md mb-2 font-semibold'>Daftar Tugas</h4>
        {tugasList.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            Belum ada tugas ditambahkan.
          </p>
        )}

        <div className='space-y-3'>
          {tugasList.map((tugas) => (
            <Card key={tugas.id} className='relative cursor-pointer p-4'>
              <button className='absolute right-2 top-2 text-gray-500 hover:text-red-500'>
                <Trash2 size={16} />
              </button>
              <p className='font-semibold'>{tugas.judul}</p>
              <p className='text-sm text-muted-foreground'>{tugas.deskripsi}</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                {tugas.deadline}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <InputNilaiKelas />
    </div>
  );
}
