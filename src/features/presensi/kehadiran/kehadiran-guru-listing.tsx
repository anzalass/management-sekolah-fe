'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as KehadiranGuruTable } from '@/components/ui/table/data-table';
import { columns } from './kehadiran-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { useSession } from 'next-auth/react';

export type KehadiranGuru = {
  id: string;
  tanggal: string; // ISO date string
  jamMasuk: string; // format: "HH:mm:ss"
  jamPulang: string; // format: "HH:mm:ss"
  status: string;
  idGuru: string;
  nama: string;
  nip: string;
};

export default function KehadiranGuruListingPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nip = searchParams.get('nip') || '';
  const tanggal = searchParams.get('tanggal') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<KehadiranGuru[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}kehadiran-guru?page=${page}&pageSize=${pageLimit}&nama=${search}&nip=${nip}&tanggal=${tanggal}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data.data);
        setTotalData(response.data.total);
      } catch (error) {
        console.error('Error fetching kehadiran guru:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, nip, tanggal, trigger, pageLimit]);

  return (
    <KehadiranGuruTable columns={columns} data={data} totalItems={totalData} />
  );
}
