'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as GuruStaffTable } from '@/components/ui/table/data-table';
import { columns } from './guru-staff-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

export type Guru = {
  id: string;
  nip: string;
  nik: string;
  password: string;
  jabatan: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string | null;
  alamat: string;
  agama: string;
  jenisKelamin: 'Laki Laki' | 'Perempuan';
  noTelepon: string;
  email: string;
  status: 'AKTIF' | 'NONAKTIF'; // Sesuai kemungkinan status
  foto: string;
  fotoId: string;
};

export default function GuruStaffListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nip = searchParams.get('nip') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Guru[]>([]);
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetchGuruStaff = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}user/get-all-guru?page=${page}?pageSize=${pageLimit}&nama=${search}&nip=${nip}`
        );
        setData(response.data.result.data);
        setTotalUser(response.data.result.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuruStaff();
  }, [page, search, nip, pageLimit, trigger]); // Re-fetch data when query changes

  return (
    <GuruStaffTable columns={columns} data={data} totalItems={totalUser} />
  );
}
