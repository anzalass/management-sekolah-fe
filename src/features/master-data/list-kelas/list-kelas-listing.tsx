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

export default function ListKelasListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<ListKelas[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}list-kelas?page=${page}&pageSize=${pageLimit}&nama=${search}`
        );
        setData(response.data.data);
        setTotalData(response.data.total);
      } catch (error) {
        toast.error('Error fetching data');
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
