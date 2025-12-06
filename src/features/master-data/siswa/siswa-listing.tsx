'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as SiswaTable } from '@/components/ui/table/data-table';
import { columns } from './siswa-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

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
  const nis = searchParams.get('nip') || '';
  const pageLimit = searchParams.get('limit') || '10';
  const kelas = searchParams.get('kelas') || '';

  const [data, setData] = useState<Siswa[]>([]);
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `user/get-all-siswa?page=${page}&pageSize=${pageLimit}&nama=${search}&nis=${nis}&kelas${kelas}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.result.data);
        setTotalUser(response.data.result.total);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchSiswa();
  }, [page, search, nis, pageLimit, kelas, trigger]); // Re-fetch data when query changes

  return <SiswaTable columns={columns} data={data} totalItems={totalUser} />;
}
