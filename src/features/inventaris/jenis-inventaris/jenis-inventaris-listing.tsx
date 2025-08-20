'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as JenisInventarisTable } from '@/components/ui/table/data-table';
import { columns } from './jenis-inventaris-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { JenisInventaris } from './jenis-inventaris-form';
import { toast } from 'sonner';

export default function JenisInventarisListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<JenisInventaris[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}jenis-inventaris?page=${page}&pageSize=${pageLimit}&nama=${search}`
        );
        setData(response.data.data.data);
        setTotalData(response.data.data.totalData);
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, trigger, pageLimit]);

  return (
    <JenisInventarisTable
      columns={columns}
      data={data}
      totalItems={totalData}
    />
  );
}
