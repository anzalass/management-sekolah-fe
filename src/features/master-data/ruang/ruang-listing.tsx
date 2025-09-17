'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as RuanganTable } from '@/components/ui/table/data-table';
import { columns } from './ruang-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export type Ruangan = {
  id: string;
  nama: string;
  keterangan: string;
};

export default function RuangListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const pageLimit = searchParams.get('limit') || '10';
  const { data: session } = useSession();
  const [data, setData] = useState<Ruangan[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `ruang?page=${page}&pageSize=${pageLimit}&nama=${search}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data);
        setTotalData(response.data.total);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, pageLimit]); // Re-fetch data when query changes

  return <RuanganTable columns={columns} data={data} totalItems={totalData} />;
}
