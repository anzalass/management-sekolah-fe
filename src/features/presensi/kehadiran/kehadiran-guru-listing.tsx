'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as KehadiranGuruTable } from '@/components/ui/table/data-table';
import { columns } from './kehadiran-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import api from '@/lib/api';

export type KehadiranGuru = {
  id: string;
  tanggal: string; // ISO date string
  jamMasuk: string; // format: "HH:mm:ss"
  jamPulang: string; // format: "HH:mm:ss"
  fotoMasuk: string;
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
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<KehadiranGuru[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `kehadiran-guru?page=${page}&pageSize=${pageLimit}&nama=${search}&nip=${nip}&startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data.data);
        setTotalData(response.data.data.total);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, nip, startDate, endDate, trigger, pageLimit]);

  return (
    <KehadiranGuruTable columns={columns} data={data} totalItems={totalData} />
  );
}
