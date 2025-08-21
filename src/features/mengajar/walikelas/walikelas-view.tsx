'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PengumumanKelas from './pengumuman-kelas';
import CatatanPerkembanganSiswa from './perkembangan-siswa';
import axios from 'axios';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PresensiSiswa from './presensi-siswa';
import Link from 'next/link';

type IDKelas = {
  id: string;
};

interface Student {
  id: string;
  namaSiswa: string;
  nisSiswa: string;
}

interface Student2 {
  id: string;
  nama: string;
  nis: string;
}

interface Izin {
  id: number;
  studentId: number;
  studentName: string;
  tanggal: string;
  alasan: string;
}

export type PengumumanKelasType = {
  id: string;
  idKelas: string;
  title: string;
  time: Date; // Kalau data dari API biasanya string, bisa diganti string
  content: string;
};

export type CatatanPerkembanganSiswaType = {
  id: string;
  idSiswa: string;
  nama: string;
  catatan: string;
};

const DashboardWaliKelas = ({ id }: IDKelas) => {
  const { data: session } = useSession();
  const { trigger, toggleTrigger } = useRenderTrigger();
  const [masterSiswa, setMasterSiswa] = useState<Student2[]>([]);
  const [kelasSiswa, setKelasSiswa] = useState<Student[]>([]);
  const [pengumumanKelas, setPengumumanKelas] = useState<PengumumanKelasType[]>(
    []
  );
  const [catatanPerkembangan, setCatatanPerkembangan] = useState<
    CatatanPerkembanganSiswaType[]
  >([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMasterSiswa, setFilteredMasterSiswa] = useState<Student2[]>(
    []
  );
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}user/get-all-siswa`
      );
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}kelas-walikelas/siswa/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      const response3 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard-walikelas/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );

      setMasterSiswa(response.data.result.data);
      setKelasSiswa(response2?.data);
      setPengumumanKelas(response3?.data?.data?.pengumuman);
      setCatatanPerkembangan(response3?.data?.data?.catatanMap);
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
        s?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !kelasSiswa?.find((k: any) => k?.Siswa?.nis === s?.nis) // jangan tampilkan yg sudah masuk kelas
    );
    setFilteredMasterSiswa(filtered);
  }, [searchTerm, masterSiswa, kelasSiswa]);

  const handleAddSiswaToKelas = async (siswa: Student2) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}kelas-walikelas/add`,
        {
          nisSiswa: siswa.nis,
          namaSiswa: siswa.nama,
          idSiswa: siswa.id,
          idKelas: id // pastikan juga kirim ID kelasMapel
        }
      );

      toast.success('Siswa berhasil ditambahkan ke kelas');
      toggleTrigger();
      setSearchTerm('');
    } catch (error) {
      toast.error('Gagal menambahkan siswa ke kelas');
    }
  };

  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState({ tanggalUnik: [], tableData: [] });
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   async function fetchAbsensi() {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/absensi/${id}`); // sesuaikan endpoint-nya
  //       if (!res.ok) throw new Error('Failed to fetch absensi data');
  //       const json = await res.json();
  //       setData(json);
  //     } catch (err: any) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   if (id) fetchAbsensi();
  // }, [id]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;
  // if (data.tableData.length === 0) return <p>Tidak ada data absensi</p>;

  return (
    <div className='space-y-8 overflow-x-auto p-4 pb-16'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>Dashboard Wali Kelas</h1>
        <div className='flex gap-2'>
          <Button asChild variant='default'>
            <Link href={`/dashboard/mengajar/walikelas/${id}/rekap-absensi`}>
              Rekap Absensi
            </Link>
          </Button>
          <Button asChild variant='default'>
            <Link href={`/dashboard/mengajar/walikelas/${id}/rekap-nilai`}>
              Rekap Nilai
            </Link>
          </Button>
          <Button asChild variant='default'>
            <Link href={`/dashboard/mengajar/walikelas/${id}/list-siswa`}>
              List Siswa
            </Link>
          </Button>
          <Button asChild variant='default'>
            <Link href={`/dashboard/mengajar/walikelas/${id}/kartu-ujian`}>
              Cetak Kartu Ujian
            </Link>
          </Button>
        </div>
      </div>

      <div className='w-[100%] overflow-x-scroll'>
        <PresensiSiswa idKelas={id} />
      </div>

      <Card className='w-full'>
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

      <PengumumanKelas pengumuman={pengumumanKelas} id={id} />
      <CatatanPerkembanganSiswa
        catatanList={catatanPerkembangan}
        idKelas={id}
        siswa={kelasSiswa}
      />

      {/* <div className='overflow-auto'>
        <table className='min-w-full border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-2 py-1'>Nama Siswa</th>
              {data.tanggalUnik.map((tgl) => (
                <th key={tgl} className='border px-2 py-1 text-center'>
                  {new Date(tgl).toLocaleDateString('id-ID', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row) => (
              <tr
                key={row?.idSiswa || row.nisSiswa}
                className='hover:bg-gray-50'
              >
                <td className='border px-2 py-1'>{row.namaSiswa}</td>
                {data.tanggalUnik.map((tgl) => (
                  <td key={tgl} className='border px-2 py-1 text-center'>
                    {row[tgl]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default DashboardWaliKelas;
