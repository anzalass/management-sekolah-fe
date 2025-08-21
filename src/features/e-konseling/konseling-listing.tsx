'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as KonselingTable } from '@/components/ui/table/data-table';
import { columns, Konseling } from './konseling-tables/columns';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function KonselingListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nis = searchParams.get('nis') || '';
  const tanggal = searchParams.get('tanggal') || '';

  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Konseling[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKonseling = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}konseling?page=${page}&pageSize=${pageLimit}&nama=${search}&nis=${nis}&tanggal=${tanggal}`
        );
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        toast.error('Error fetching data');
        setError('An error occurred while fetching the registration data');
      } finally {
        setLoading(false);
      }
    };

    fetchKonseling();
  }, [page, pageLimit, search]);

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return <KonselingTable columns={columns} data={data} totalItems={0} />;
}
