'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as SiswaTable } from '@/components/ui/table/data-table';
import { columns } from './pendaftaran-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { Pendaftaran } from './pendaftaran-form';

export default function PendaftaranListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const studentName = searchParams.get('studentName') || '';
  const parentName = searchParams.get('parentName') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Pendaftaran[]>([]);
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}pendaftaran?page=${page}?pageSize=${pageLimit}&studentName=${studentName}&parentName=${parentName}`
        );
        setData(response.data.data.data);
        setTotalUser(response.data.result.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiswa();
  }, [page, studentName, pageLimit, parentName, trigger]); // Re-fetch data when query changes

  return <SiswaTable columns={columns} data={data} totalItems={totalUser} />;
}
