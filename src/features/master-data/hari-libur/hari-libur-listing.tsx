'use client';

import { useEffect, useState } from 'react';
import { DataTable as HariLibur } from '@/components/ui/table/data-table';
import { columns } from './hari-libur-tables/columns';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export type HariLibur = {
  id: string;
  namaHari: string;
  tanggal: string;
};

export default function HariLiburListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('namaHari') || '';
  const tanggal = searchParams.get('tanggal') || '';
  const pageLimit = searchParams.get('limit') || '10';
  const { data: session } = useSession();
  const [data, setData] = useState<HariLibur[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/hari-libur`, {
          params: {
            page,
            pageSize: pageLimit,
            namaHari: search || undefined,
            tanggal: tanggal || undefined
          },
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        });

        setData(response.data.data);
        setTotalData(response.data.pagination.total);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageLimit, search, tanggal]);

  return <HariLibur columns={columns} data={data} totalItems={totalData} />;
}
