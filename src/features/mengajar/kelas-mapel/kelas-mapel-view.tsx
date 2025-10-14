'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputNilaiKelas from './input-nilai-kelas';
import ModalMateri from './tambah-materi-kelas';
import { Edit, Eye, Trash2 } from 'lucide-react';
import ModalTugas from './tambah-tugas';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import api from '@/lib/api';
import CatatanAkhirSiswa from './catatan-akhir';
import TambahUjian from './tambah-ujian';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CatatanPerkembanganSiswa from '../walikelas/perkembangan-siswa';

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
  const queryClient = useQueryClient();

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [showTugasModal, setShowTugasModal] = useState(false);

  // search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMateri, setSearchMateri] = useState('');
  const [searchTugas, setSearchTugas] = useState('');
  const [searchUjian, setSearchUjian] = useState('');

  // ================== FETCHING ==================
  const { data: masterSiswa = [] } = useQuery<Student[]>({
    queryKey: ['masterSiswa'],
    queryFn: async () => {
      const res = await api.get(`user/get-all-siswa-master`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.result.data;
    },
    enabled: !!session?.user?.token
  });

  const { data: kelasData } = useQuery({
    queryKey: ['kelasMapel', id],
    queryFn: async () => {
      const res = await api.get(`dashboard-kelas-mapel/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  const kelasSiswa = kelasData?.siswaKelas || [];
  const materiList = kelasData?.materiKelas || [];
  const tugasList = kelasData?.tugasKelas || [];
  const ujianList = kelasData?.ujianKelas || [];

  // ================== MUTATIONS ==================
  const addSiswaMutation = useMutation({
    mutationFn: async (siswa: Student) =>
      api.post(
        `kelas-mapel/add-siswa`,
        {
          idSiswa: siswa.id,
          nisSiswa: siswa.nis,
          namaSiswa: siswa.nama,
          idKelas: id
        },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      ),
    onSuccess: () => {
      toast.success('Siswa berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', id] });
      setSearchTerm('');
    },
    onError: () => toast.error('Gagal menambahkan siswa')
  });

  const hapusSiswaMutation = useMutation({
    mutationFn: async (idSiswa: string) =>
      api.delete(`kelas-mapel/remove-siswa/${idSiswa}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      }),
    onSuccess: () => {
      toast.success('Berhasil menghapus siswa');
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', id] });
    },
    onError: () => toast.error('Gagal menghapus siswa')
  });

  const hapusMateriMutation = useMutation({
    mutationFn: async (idMateri: number) =>
      api.delete(`materi/${idMateri}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      }),
    onSuccess: () => {
      toast.success('Materi dihapus');
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', id] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Terjadi kesalahan')
  });

  const hapusTugasMutation = useMutation({
    mutationFn: async (idTugas: number) =>
      api.delete(`tugas/${idTugas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      }),
    onSuccess: () => {
      toast.success('Tugas dihapus');
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', id] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Terjadi kesalahan')
  });

  const hapusUjianMutation = useMutation({
    mutationFn: async (idUjian: number) =>
      api.delete(`ujian-iframe/${idUjian}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      }),
    onSuccess: () => {
      toast.success('Ujian dihapus');
      queryClient.invalidateQueries({ queryKey: ['kelasMapel', id] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Terjadi kesalahan')
  });

  // ================== FILTER ==================
  const filteredMasterSiswa = masterSiswa.filter(
    (s) =>
      s?.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !kelasSiswa?.find((k: any) => k.Siswa.nis === s.nis)
  );

  const filteredMateri = materiList.filter((m: Materi) =>
    m.judul.toLowerCase().includes(searchMateri.toLowerCase())
  );
  const filteredTugas = tugasList.filter((t: Tugas) =>
    t.judul.toLowerCase().includes(searchTugas.toLowerCase())
  );
  const filteredUjian = ujianList.filter((u: any) =>
    u.nama.toLowerCase().includes(searchUjian.toLowerCase())
  );

  // ================== RENDER ==================
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>
        Dashboard Kelas Mapel - {kelasData?.namaKelas} - {kelasData?.kelas}
      </h1>

      {/* Tambah siswa */}
      <Card className='block justify-between gap-4 p-4 lg:flex'>
        <Card className='w-full lg:w-1/2'>
          <CardHeader>
            <CardTitle className='text-base'>Tambah Siswa ke Kelas</CardTitle>
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
                        onClick={() => addSiswaMutation.mutate(siswa)}
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

        {/* daftar siswa */}
        <Card className='w-full lg:w-1/2'>
          <CardHeader>
            <CardTitle className='text-base'>
              Daftar Siswa di Kelas Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='ml-5 w-fit list-disc'>
              {kelasSiswa.map((s: any, index: number) => (
                <li
                  key={s.id ?? index}
                  className='mt-3 flex items-center justify-between'
                >
                  <span>
                    {s.Siswa.nama} - {s.Siswa.nis}
                  </span>
                  <Trash2
                    className='ml-5 cursor-pointer'
                    size={16}
                    onClick={() => hapusSiswaMutation.mutate(s.id)}
                  />
                </li>
              ))}
            </ul>
            {kelasSiswa.length === 0 && <p>Belum ada Siswa</p>}
          </CardContent>
        </Card>
      </Card>

      <div className='flex space-x-2'>
        <Link href={`/mengajar/kelas-mapel/${id}/materi/add/new`}>
          <Button>Tambah Materi</Button>
        </Link>
        <Link href={`/mengajar/kelas-mapel/${id}/tugas/add/new`}>
          <Button>Tambah Tugas</Button>
        </Link>
        <TambahUjian idKelasMapel={id} />
      </div>

      <ModalMateri idKelas={id} open={showModal} onOpenChange={setShowModal} />
      <ModalTugas
        idKelas={id}
        open={showTugasModal}
        onOpenChange={setShowTugasModal}
      />

      <Card className='p-5'>
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
            {filteredMateri?.map((materi: any) => (
              <Card
                key={materi.id}
                className='group relative cursor-pointer p-4 shadow-sm transition-all duration-200 hover:shadow-md'
              >
                {/* Tombol aksi */}
                <div className='absolute right-2 top-2 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                  {/* Tombol detail */}
                  <Link
                    href={`/mengajar/kelas-mapel/${id}/materi/${materi.id}`}
                    className='rounded-md p-1.5 transition-colors hover:bg-blue-100 hover:text-blue-600'
                    title='Lihat Detail'
                  >
                    <Eye size={16} />
                  </Link>

                  {/* Tombol edit */}
                  <Link
                    href={`/mengajar/kelas-mapel/${id}/materi/add/${materi.id}`}
                    className='rounded-md p-1.5 transition-colors hover:bg-yellow-100 hover:text-yellow-600'
                    title='Edit Materi'
                  >
                    <Edit size={16} />
                  </Link>

                  {/* Tombol hapus */}
                  <button
                    onClick={() => hapusMateriMutation.mutate(materi.id)}
                    className='rounded-md p-1.5 transition-colors hover:bg-red-100 hover:text-red-600'
                    title='Hapus Materi'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <Link
                  href={`/mengajar/kelas-mapel/${id}/materi/${materi.id}`}
                  className='mt-2'
                >
                  <p className='font-semibold'>{materi.judul}</p>
                </Link>
                <p className='text-sm text-muted-foreground'>
                  Dibuat:{' '}
                  {dayjs(materi?.tanggal).locale('id').format('DD MMMM YYYY')}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Tugas */}
        <div className='mt-9'>
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
            {filteredTugas?.map((tugas: any) => (
              <Card
                key={tugas.id}
                className='group relative cursor-pointer p-4 shadow-sm transition-all duration-200 hover:shadow-md'
              >
                {/* Tombol aksi */}
                <div className='absolute right-2 top-2 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                  {/* Tombol detail */}
                  <Link
                    href={`/mengajar/kelas-mapel/${id}/tugas/${tugas.id}`}
                    className='rounded-md p-1.5 transition-colors hover:bg-blue-100 hover:text-blue-600'
                    title='Lihat Detail'
                  >
                    <Eye size={16} />
                  </Link>

                  {/* Tombol edit */}
                  <Link
                    href={`/mengajar/kelas-mapel/${id}/tugas/add/${tugas.id}`}
                    className='rounded-md p-1.5 transition-colors hover:bg-yellow-100 hover:text-yellow-600'
                    title='Edit Tugas'
                  >
                    <Edit size={16} />
                  </Link>

                  {/* Tombol hapus */}
                  <button
                    onClick={() => hapusTugasMutation.mutate(tugas.id)}
                    className='rounded-md p-1.5 transition-colors hover:bg-red-100 hover:text-red-600'
                    title='Hapus Tugas'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Konten card */}
                <div className='flex flex-col gap-1'>
                  <p className='line-clamp-1 text-base font-semibold'>
                    {tugas.judul}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Deadline:{' '}
                    <span className='font-medium'>
                      {dayjs(tugas.deadline)
                        .locale('id')
                        .format('DD MMMM YYYY')}
                    </span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Ujian */}
        <div className='mt-9'>
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
            {filteredUjian?.map((ujian: any) => (
              <Card key={ujian.id} className='relative cursor-pointer p-4'>
                <button
                  onClick={() => hapusUjianMutation.mutate(ujian.id)}
                  className='absolute right-2 top-2 hover:text-red-500'
                >
                  <Trash2 size={16} />
                </button>
                <Link
                  href={`/mengajar/kelas-mapel/${id}/ujian/${ujian.id}`}
                  className='mt-2'
                >
                  <p className='font-semibold'>{ujian.nama}</p>
                </Link>
                <p className='text-sm text-muted-foreground'>
                  Deadline:{' '}
                  {dayjs(ujian?.deadline).locale('id').format('DD MMMM YYYY')}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <InputNilaiKelas listSiswa={kelasSiswa} idKelas={id} />
      <CatatanAkhirSiswa listSiswa={kelasSiswa} idKelasMapel={id} />
    </div>
  );
}
