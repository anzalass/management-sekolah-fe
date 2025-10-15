'use client';

import { useEffect, useState } from 'react';
import { DataTable as KonselingTable } from '@/components/ui/table/data-table';
import { columns, Konseling } from './konseling-tables/columns';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { columnsMengajar } from './konseling-tables/columns-mengajar';

export default function KonselingListingPageMengajar() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nis = searchParams.get('nis') || '';
  const tanggal = searchParams.get('tanggal') || '';
  const { data: session } = useSession();

  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Konseling[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKonseling = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `konseling?page=${page}&pageSize=${pageLimit}&nama=${search}&nis=${nis}&tanggal=${tanggal}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.total);
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

    fetchKonseling();
  }, [page, pageLimit, search, nis, tanggal]);

  return (
    <KonselingTable
      columns={columnsMengajar}
      data={data}
      totalItems={totalData}
    />
  );
}
