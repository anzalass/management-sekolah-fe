'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as ListKelasTable } from '@/components/ui/table/data-table';
import { columns } from './list-kelas-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';
import { ListKelas } from './list-kelas-form';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function ListKelasListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<ListKelas[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `list-kelas?page=${page}&pageSize=${pageLimit}&nama=${search}`,
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
  }, [page, search, trigger, pageLimit]);

  return (
    <ListKelasTable columns={columns} data={data} totalItems={totalData} />
  );
}
