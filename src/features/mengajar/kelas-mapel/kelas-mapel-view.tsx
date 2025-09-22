'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputNilaiKelas from './input-nilai-kelas';
import ModalMateri from './tambah-materi-kelas';
import { Trash2 } from 'lucide-react';
import ModalTugas from './tambah-tugas';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import api from '@/lib/api';
import CatatanAkhirSiswa from './catatan-akhir';
import TambahUjian from './tambah-ujian';

interface Student {
  id: string;
  nama: string;
  nis?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  kelas?: string;
}

interface Materi {
  id: number;
  judul: string;
  konten: string;
  tanggal: string;
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
  const { data: session } = useSession();
  const { trigger, toggleTrigger } = useRenderTrigger();

  const [masterSiswa, setMasterSiswa] = useState<Student[]>([]);
  const [kelasSiswa, setKelasSiswa] = useState<Student[]>([]);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [tugasList, setTugasList] = useState<Tugas[]>([]);
  const [ujianList, setUjianList] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showTugasModal, setShowTugasModal] = useState(false);

  // search siswa
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMasterSiswa, setFilteredMasterSiswa] = useState<Student[]>([]);

  // search materi/tugas/ujian
  const [searchMateri, setSearchMateri] = useState('');
  const [searchTugas, setSearchTugas] = useState('');
  const [searchUjian, setSearchUjian] = useState('');

  const fetchData = async () => {
    try {
      const response = await api.get(`user/get-all-siswa`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      const response2 = await api.get(`dashboard-kelas-mapel/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setMasterSiswa(response.data.result.data);
      setKelasSiswa(response2?.data?.data.siswaKelas);
      setMateriList(response2?.data?.data.materiKelas);
      setUjianList(response2?.data?.data.ujianKelas);
      setTugasList(response2?.data?.data.tugasKelas);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  useEffect(() => {
    fetchData();
  }, [trigger]);

  useEffect(() => {
    const filtered = masterSiswa.filter(
      (s) =>
        s?.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !kelasSiswa?.find((k: any) => k.Siswa.nis === s.nis)
    );
    setFilteredMasterSiswa(filtered);
  }, [searchTerm, masterSiswa, kelasSiswa]);

  const hapusMateri = async (id: any) => {
    try {
      await api.delete(`materi/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      toast.success('Berhasil menghapus materi');
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const hapusTugas = async (id: any) => {
    try {
      await api.delete(`tugas/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      toast.success('Berhasil menghapus tugas');
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const hapusUjian = async (id: any) => {
    try {
      await api.delete(`ujian-iframe/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      toast.success('Berhasil menghapus Ujian');
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  // filter array FE
  const filteredMateri = materiList.filter((m) =>
    m.judul.toLowerCase().includes(searchMateri.toLowerCase())
  );
  const filteredTugas = tugasList.filter((t) =>
    t.judul.toLowerCase().includes(searchTugas.toLowerCase())
  );
  const filteredUjian = ujianList.filter((u) =>
    u.nama.toLowerCase().includes(searchUjian.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard Kelas Mapel</h1>

      {/* Siswa */}
      {/* ... bagian siswa tetap sama ... */}

      <div className='flex space-x-2'>
        <Button onClick={() => setShowModal(true)}>Tambah Materi</Button>
        <Button onClick={() => setShowTugasModal(true)}>Tambah Tugas</Button>
        <TambahUjian idKelasMapel={id} />
      </div>

      <ModalMateri idKelas={id} open={showModal} onOpenChange={setShowModal} />
      <ModalTugas
        idKelas={id}
        open={showTugasModal}
        onOpenChange={setShowTugasModal}
      />

      {/* Materi */}
      <div>
        <h4 className='text-md mb-2 font-semibold'>Daftar Materi</h4>
        <Input
          placeholder='Cari materi...'
          value={searchMateri}
          onChange={(e) => setSearchMateri(e.target.value)}
          className='mb-2 w-80'
        />
        {filteredMateri?.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            Tidak ada materi ditemukan.
          </p>
        )}
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
          {filteredMateri?.map((materi) => (
            <Card key={materi.id} className='relative cursor-pointer p-4'>
              <button
                onClick={() => hapusMateri(materi.id)}
                className='absolute right-2 top-2 text-gray-500 hover:text-red-500'
              >
                <Trash2 size={16} />
              </button>
              <Link
                href={`/mengajar/kelas-mapel/${id}/materi/${materi.id}`}
                className='mt-2'
              >
                <p className='font-semibold'>{materi.judul}</p>
              </Link>
              <p className='text-sm text-muted-foreground'>
                Dibuat pada:{' '}
                {dayjs(materi?.tanggal).locale('id').format('DD MMMM YYYY')}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Tugas */}
      <div>
        <h4 className='text-md mb-2 font-semibold'>Daftar Tugas</h4>
        <Input
          placeholder='Cari tugas...'
          value={searchTugas}
          onChange={(e) => setSearchTugas(e.target.value)}
          className='mb-2 w-80'
        />
        {filteredTugas?.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            Tidak ada tugas ditemukan.
          </p>
        )}
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
          {filteredTugas?.map((tugas) => (
            <Card key={tugas.id} className='relative cursor-pointer p-4'>
              <button
                onClick={() => hapusTugas(tugas.id)}
                className='absolute right-2 top-2 text-gray-500 hover:text-red-500'
              >
                <Trash2 size={16} />
              </button>
              <Link
                href={`/mengajar/kelas-mapel/${id}/tugas/${tugas.id}`}
                className='mt-2'
              >
                <p className='font-semibold'>{tugas.judul}</p>
              </Link>
              <p className='text-sm text-muted-foreground'>
                Deadline:{' '}
                {dayjs(tugas?.deadline).locale('id').format('DD MMMM YYYY')}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Ujian */}
      <div>
        <h4 className='text-md mb-2 font-semibold'>Daftar Ujian</h4>
        <Input
          placeholder='Cari ujian...'
          value={searchUjian}
          onChange={(e) => setSearchUjian(e.target.value)}
          className='mb-2 w-80'
        />
        {filteredUjian?.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            Tidak ada ujian ditemukan.
          </p>
        )}
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
          {filteredUjian?.map((ujian) => (
            <Card key={ujian.id} className='relative cursor-pointer p-4'>
              <button
                onClick={() => hapusUjian(ujian.id)}
                className='absolute right-2 top-2 text-gray-500 hover:text-red-500'
              >
                <Trash2 size={16} />
              </button>
              <p className='font-semibold'>{ujian.nama}</p>
              <p className='text-sm text-muted-foreground'>
                Deadline:{' '}
                {dayjs(ujian?.deadline).locale('id').format('DD MMMM YYYY')}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <InputNilaiKelas listSiswa={kelasSiswa} idKelas={id} />
      <CatatanAkhirSiswa listSiswa={kelasSiswa} idKelasMapel={id} />
    </div>
  );
}
