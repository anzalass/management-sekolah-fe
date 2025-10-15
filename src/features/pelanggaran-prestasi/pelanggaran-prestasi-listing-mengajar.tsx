'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as PelanggaranPrestasiTable } from '@/components/ui/table/data-table';
import {
  columns,
  PelanggaranPrestasi
} from './pelanggaran-predtasi-tables/columns';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { useSession } from 'next-auth/react';
import { columnsMengajar } from './pelanggaran-predtasi-tables/columns-mengajar';

export default function PelanggaranPrestasiListingPageMengajar() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nis = searchParams.get('nis') || '';
  const tanggal = searchParams.get('waktu') || '';
  const jenis = searchParams.get('jenis') || '';

  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<PelanggaranPrestasi[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPelanggaranPrestasi = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `pelanggaran-prestasi?page=${page}&pageSize=${pageLimit}&nama=${search}&nis=${nis}&waktu=${tanggal}&jenis=${jenis}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        if (response.data) {
          setData(response.data.result.data);
          setTotalData(response.data.result.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        setError('An error occurred while fetching the registration data');
      } finally {
        setLoading(false);
      }
    };

    fetchPelanggaranPrestasi();
  }, [page, pageLimit, search, tanggal, trigger, jenis, nis]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PelanggaranPrestasiTable
      columns={columnsMengajar}
      data={data}
      totalItems={totalData}
    />
  );
}
