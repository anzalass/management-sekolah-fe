import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import ModalInputNilaiManual from './modal-input-manual';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

// Tipe Props
interface Student {
  id: string;
  nama: string;
  nis?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  kelas?: string;
}
type InputNilaiProps = {
  idKelas: string;
  listSiswa: Student[];
};

// Tipe data nilai siswa
type NilaiItem = {
  id: string;
  nama: string;
  nilai: number;
  jenisNilai: string;
};

// Tipe untuk form tambah jenis nilai
type JenisNilaiForm = {
  jenis: string;
  bobot: number;
};

export default function InputNilaiKelas({
  idKelas,
  listSiswa
}: InputNilaiProps) {
  const { register, handleSubmit, reset } = useForm<JenisNilaiForm>();
  const [openModal, setOpenModal] = useState(false);
  const [listNilai, setListNilai] = useState<NilaiItem[]>([]);
  const [fullNilaiList, setFullNilaiList] = useState<NilaiItem[]>([]);
  const [jenisNilai, setJenisNilai] = useState<any[]>([]);
  const [defaultJenisNilai, setDefaultJenisNilai] = useState<string>('');
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  // Ambil data jenis nilai + nilai siswa
  const fetchJenisNilai = async () => {
    try {
      const res = await api.get(`penilaian/kelas/${idKelas}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      const jenisData = res.data.jenisNilai;
      const nilaiSiswa = res.data.nilaiSiswa ?? [];

      setJenisNilai(jenisData);
      setFullNilaiList(nilaiSiswa);

      const jenisAwal = jenisData[0]?.jenis ?? '';
      setDefaultJenisNilai(jenisAwal);

      const filtered = nilaiSiswa.filter(
        (item: NilaiItem) => item.jenisNilai === jenisAwal
      );
      setListNilai(filtered);
    } catch (err) {
      toast.error('Gagal fetch data');
    }
  };

  useEffect(() => {
    fetchJenisNilai();
  }, [idKelas, trigger]);

  useEffect(() => {
    const filtered = fullNilaiList.filter(
      (item: NilaiItem) => item.jenisNilai === defaultJenisNilai
    );
    setListNilai(filtered);
  }, [defaultJenisNilai, fullNilaiList, trigger]);

  // Tambah jenis penilaian
  const onSubmit = async (data: JenisNilaiForm) => {
    try {
      await api.post(
        `penilaian`,
        {
          idKelasMapel: idKelas,
          jenis: data.jenis,
          bobot: Number(data.bobot)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      reset();
      fetchJenisNilai();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'Gagal tambah jenis nilai');
    }
  };

  // Tambah state untuk edit jenis nilai
  const [editJenis, setEditJenis] = useState<{
    id: string;
    jenis: string;
    bobot: number;
  } | null>(null);

  // Edit jenis nilai
  const handleEditJenis = (item: any) => {
    setEditJenis(item);
  };

  // Simpan edit jenis nilai
  const handleUpdateJenis = async () => {
    if (!editJenis) return;
    try {
      await api.put(
        `penilaian/${editJenis.id}`,
        {
          jenis: editJenis.jenis,
          bobot: Number(editJenis.bobot)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      toast.success('Jenis penilaian berhasil diupdate');
      setEditJenis(null);
      fetchJenisNilai();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  // Hapus jenis nilai
  const handleDeleteJenis = async (id: string) => {
    try {
      await api.delete(`penilaian/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      toast.success('Jenis penilaian berhasil dihapus');
      toggleTrigger();
      fetchJenisNilai();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  // Simpan nilai per siswa
  const SimpanNilai = async (nilai: NilaiItem) => {
    try {
      await api.put(
        `nilai-siswa/${nilai.id}`,
        {
          nilai: nilai.nilai
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      toast.success('Berhasil Menyimpan Nilai');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const DeleteNilai = async (nilai: NilaiItem) => {
    try {
      await api.delete(`nilai-siswa/${nilai.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      toast.success('Berhasil menghapus Nilai');
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  // Handle ubah nilai dari input
  const handleChangeNilai = (index: number, newValue: string) => {
    const parsedValue = parseInt(newValue);
    const safeValue = isNaN(parsedValue) ? 0 : parsedValue;

    const updated = [...listNilai];
    updated[index] = { ...updated[index], nilai: safeValue };
    setListNilai(updated);

    // Juga update full list biar sinkron kalau ganti jenis nilai
    const fullUpdated = fullNilaiList.map((item) =>
      item.id === updated[index].id ? updated[index] : item
    );
    setFullNilaiList(fullUpdated);
  };

  return (
    <div className='space-y-6'>
      {/* Section Jenis Penilaian */}
      <Card>
        <CardHeader>
          <CardTitle>Jenis Penilaian</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex flex-wrap gap-2'>
            {jenisNilai.map((d: any, i) => (
              <div
                key={i}
                className='flex items-center gap-2 rounded border px-2 py-1'
              >
                {editJenis?.id === d.id ? (
                  <>
                    <Input
                      value={editJenis?.jenis ?? ''}
                      onChange={(e) => {
                        if (editJenis) {
                          setEditJenis({
                            id: editJenis.id,
                            jenis: e.target.value,
                            bobot: editJenis.bobot
                          });
                        }
                      }}
                      className='w-24'
                    />

                    <Input
                      type='number'
                      value={editJenis?.bobot ?? 0}
                      onChange={(e) => {
                        if (editJenis) {
                          setEditJenis({
                            id: editJenis.id,
                            jenis: editJenis.jenis,
                            bobot: Number(e.target.value)
                          });
                        }
                      }}
                      className='w-20'
                    />

                    <Button size='sm' onClick={handleUpdateJenis}>
                      Save
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setEditJenis(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={
                        d.jenis === defaultJenisNilai ? 'default' : 'outline'
                      }
                      onClick={() => setDefaultJenisNilai(d.jenis)}
                    >
                      {d.jenis} - {d.bobot}%
                    </Button>
                    <div className='flex space-x-1'>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => handleEditJenis(d)}
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => handleDeleteJenis(d.id)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex w-fit gap-2 pt-4'
          >
            <Input
              placeholder='Jenis penilaian'
              {...register('jenis', { required: true })}
            />
            <Input
              type='number'
              placeholder='Bobot (%)'
              {...register('bobot', { required: true, min: 1, max: 100 })}
            />
            <Button type='submit'>Tambah</Button>
          </form>
        </CardContent>
      </Card>

      {/* Section Tabel Input Nilai */}
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle>Input Nilai: {defaultJenisNilai}</CardTitle>
            <ModalInputNilaiManual
              jenisNilaiList={jenisNilai}
              siswaList={listSiswa}
              idKelas={idKelas}
              onSuccess={fetchJenisNilai} // supaya setelah simpan data langsung refresh
            />
          </div>
        </CardHeader>
        <CardContent>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border p-2'>No</th>
                <th className='border p-2'>Nama</th>
                <th className='border p-2'>Nilai</th>
                <th className='border p-2'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {listNilai.map((nilai, index) => (
                <tr key={nilai.id}>
                  <td className='border p-2'>{index + 1}</td>
                  <td className='border p-2'>{nilai.nama}</td>
                  <td className='border p-2'>
                    <Input
                      type='number'
                      min={0}
                      max={100}
                      value={nilai.nilai}
                      onChange={(e) => handleChangeNilai(index, e.target.value)}
                    />
                  </td>
                  <td className='space-x-2 border p-2'>
                    <Button onClick={() => SimpanNilai(nilai)}>Simpan</Button>
                    <Button
                      className='bg-red-600 text-white hover:bg-red-700'
                      onClick={() => DeleteNilai(nilai)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
