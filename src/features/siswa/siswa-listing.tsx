'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as SiswaTable } from '@/components/ui/table/data-table';
import { columns } from './siswa-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';

export type Siswa = {
  id: string;
  nis: string;
  nik: string;
  password: string;
  jabatan: string;
  nama: string;
  kelas: string;
  tempatLahir: string;
  tanggalLahir: Date | null;
  alamat: string;
  agama: string;
  jenisKelamin: 'Laki Laki' | 'Perempuan';
  noTelepon: string;
  email: string;
  status: 'AKTIF' | 'NONAKTIF'; // Sesuai kemungkinan status
  foto: string;
  fotoId: string;
};

export default function SiswaListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nis = searchParams.get('nis') || '';
  const pageLimit = searchParams.get('limit') || '10';
  const kelas = searchParams.get('kelas') || '';

  const [data, setData] = useState<Siswa[]>([]);
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}user/get-all-siswa?page=${page}?pageSize=${pageLimit}&nama=${search}&nip=${nis}&kelas${kelas}`
        );
        setData(response.data.result.data);
        setTotalUser(response.data.result.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiswa();
  }, [page, search, nis, pageLimit, kelas]); // Re-fetch data when query changes

  return <SiswaTable columns={columns} data={data} totalItems={totalUser} />;
}
