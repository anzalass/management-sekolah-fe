import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { API } from '@/lib/server';
import { toast } from 'sonner';

// Tipe Props
type InputNilaiProps = {
  idKelas: string;
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

export default function InputNilaiKelas({ idKelas }: InputNilaiProps) {
  const { register, handleSubmit, reset } = useForm<JenisNilaiForm>();

  const [listNilai, setListNilai] = useState<NilaiItem[]>([]);
  const [fullNilaiList, setFullNilaiList] = useState<NilaiItem[]>([]);
  const [jenisNilai, setJenisNilai] = useState<any[]>([]);
  const [defaultJenisNilai, setDefaultJenisNilai] = useState<string>('');

  // Ambil data jenis nilai + nilai siswa
  const fetchJenisNilai = async () => {
    try {
      const res = await axios.get(`${API}penilaian/kelas/${idKelas}`);
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
      console.error('Gagal fetch data', err);
    }
  };

  useEffect(() => {
    fetchJenisNilai();
  }, [idKelas]);

  useEffect(() => {
    const filtered = fullNilaiList.filter(
      (item: NilaiItem) => item.jenisNilai === defaultJenisNilai
    );
    setListNilai(filtered);
  }, [defaultJenisNilai, fullNilaiList]);

  // Tambah jenis penilaian
  const onSubmit = async (data: JenisNilaiForm) => {
    try {
      await axios.post(`${API}penilaian`, {
        idKelasMapel: idKelas,
        jenis: data.jenis,
        bobot: Number(data.bobot)
      });
      reset();
      fetchJenisNilai();
    } catch (error: any) {
      console.error(
        error?.response?.data?.message ?? 'Gagal tambah jenis nilai'
      );
    }
  };

  // Simpan nilai per siswa
  const SimpanNilai = async (nilai: NilaiItem) => {
    try {
      await axios.put(`${API}nilai-siswa/${nilai.id}`, {
        nilai: nilai.nilai
      });
      toast.success('Berhasil Menyimpan Nilai');
    } catch (error) {
      console.error('Gagal simpan nilai', error);
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
      <h1 className='text-2xl font-bold'>Input Nilai Kelas</h1>

      {/* Section Jenis Penilaian */}
      <Card>
        <CardHeader>
          <CardTitle>Jenis Penilaian</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex flex-wrap gap-2'>
            {jenisNilai.map((d: any, i) => (
              <Button
                key={i}
                variant={d.jenis === defaultJenisNilai ? 'default' : 'outline'}
                onClick={() => setDefaultJenisNilai(d.jenis)}
              >
                {d.jenis} - {d.bobot}%
              </Button>
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
          <CardTitle>Input Nilai: {defaultJenisNilai}</CardTitle>
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
                  <td className='border p-2'>
                    <Button onClick={() => SimpanNilai(nilai)}>Simpan</Button>
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
