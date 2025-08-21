'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputNilaiKelas from './input-nilai-kelas';
import ModalMateri from './tambah-materi-kelas';
import { Trash2 } from 'lucide-react';
import ModalTugas from './tambah-tugas';
import { API } from '@/lib/server';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

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

  const [showModal, setShowModal] = useState(false);
  const [showTugasModal, setShowTugasModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMasterSiswa, setFilteredMasterSiswa] = useState<Student[]>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}user/get-all-siswa`
      );
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard-kelas-mapel/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );

      setMasterSiswa(response.data.result.data);
      setKelasSiswa(response2?.data?.data.siswaKelas);
      setMateriList(response2?.data?.data.materiKelas);
      setTugasList(response2?.data?.data.tugasKelas);
    } catch (error) {
      toast.error('Gagal fetch siswa');
    }
  };

  useEffect(() => {
    fetchData();
  }, [trigger]);

  useEffect(() => {
    const filtered = masterSiswa.filter(
      (s) =>
        s?.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !kelasSiswa?.find((k: any) => k.Siswa.nis === s.nis) // jangan tampilkan yg sudah masuk kelas
    );
    setFilteredMasterSiswa(filtered);
  }, [searchTerm, masterSiswa, kelasSiswa]);

  const handleAddSiswaToKelas = async (siswa: Student) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}kelas-mapel/add-siswa`,
        {
          idSiswa: siswa.id,
          nisSiswa: siswa.nis,
          namaSiswa: siswa.nama,
          idKelas: id // pastikan juga kirim ID kelasMapel
        }
      );

      toast.success('Siswa berhasil ditambahkan ke kelas');
      fetchData();
      setSearchTerm('');
    } catch (error) {
      toast.error('Gagal menambahkan siswa ke kelas');
    }
  };

  const hapusSiswa = async (id: any) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}kelas-mapel/remove-siswa/${id}`
      );
      toast.success('Berhasil menghapus siswa');
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal menghapus siswa');
    }
  };

  const hapusMateri = async (id: any) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}materi/${id}`);
      toast.success('Berhasil menghapus materi');
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal menghapus materi');
    }
  };

  const hapusTugas = async (id: any) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}tugas/${id}`);
      toast.success('Berhasil menghapus tugas');
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal menghapus tugas');
    }
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard Kelas Mapel</h1>

      <Card className='block justify-between gap-4 p-4 lg:flex'>
        <Card className='w-full lg:w-1/2'>
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
                  {filteredMasterSiswa?.map((siswa) => (
                    <li
                      key={siswa.nis}
                      className='flex items-center justify-between border-b pb-1 last:border-none last:pb-0'
                    >
                      <span>
                        {siswa.nama} - {siswa.nis}
                      </span>
                      <Button
                        size='sm'
                        onClick={() => handleAddSiswaToKelas(siswa)}
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

        <Card className='w-full lg:w-1/2'>
          <CardHeader>
            <CardTitle>Daftar Siswa di Kelas Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='ml-5 w-fit list-disc'>
              {kelasSiswa.map((s: any, index) => (
                <li
                  key={s.id ?? index}
                  className='mt-3 flex items-center justify-between'
                >
                  <span>
                    {s.Siswa.nama} - {s.Siswa.nis}
                  </span>

                  <Trash2
                    className='ml-5'
                    size={16}
                    onClick={() => hapusSiswa(s.id)}
                  />
                </li>
              ))}
            </ul>
            {kelasSiswa.length === 0 ? <p>Belum ada Siswa</p> : null}
          </CardContent>
        </Card>
      </Card>

      <div className='flex space-x-2'>
        <Button
          className='text-xs md:text-sm'
          onClick={() => setShowModal(true)}
        >
          Tambah Materi
        </Button>
        <Button
          className='text-xs md:text-sm'
          onClick={() => setShowTugasModal(true)}
        >
          Tambah Tugas
        </Button>
        <Button
          className='text-xs md:text-sm'
          onClick={() => setShowModal(true)}
        >
          Tambah Ujian
        </Button>
      </div>

      <ModalMateri idKelas={id} open={showModal} onOpenChange={setShowModal} />
      <ModalTugas
        idKelas={id}
        open={showTugasModal}
        onOpenChange={setShowTugasModal}
      />

      <div>
        <h4 className='text-md mb-2 font-semibold'>Daftar Materi</h4>
        {materiList?.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            Belum ada materi ditambahkan.
          </p>
        )}

        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
          {materiList?.map((materi) => (
            <Card key={materi.id} className='relative cursor-pointer p-4'>
              <button
                onClick={() => hapusMateri(materi.id)}
                className='absolute right-2 top-2 text-gray-500 hover:text-red-500'
              >
                <Trash2 size={16} />
              </button>
              <Link
                className='mt-2'
                key={materi.id}
                href={`/dashboard/mengajar/kelas-mapel/${id}/materi/${materi.id}`}
              >
                <p className='font-semibold'>{materi.judul}</p>
              </Link>{' '}
              <p className='text-sm text-muted-foreground'>
                Dibuat pada:{' '}
                {dayjs(materi?.tanggal).locale('id').format('DD MMMM YYYY')}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4 className='text-md mb-2 font-semibold'>Daftar Tugas</h4>
        {tugasList?.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            Belum ada tugas ditambahkan.
          </p>
        )}

        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
          {tugasList?.map((tugas) => (
            <Card key={tugas.id} className='relative cursor-pointer p-4'>
              <button
                onClick={() => hapusTugas(tugas.id)}
                className='absolute right-2 top-2 text-gray-500 hover:text-red-500'
              >
                <Trash2 size={16} />
              </button>
              <Link
                key={tugas.id}
                href={`/dashboard/mengajar/kelas-mapel/${id}/tugas/${tugas.id}`}
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

      <InputNilaiKelas listSiswa={kelasSiswa} idKelas={id} />
    </div>
  );
}
