'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as RuanganTable } from '@/components/ui/table/data-table';
import { columns } from './ruang-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { toast } from 'sonner';

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

  const [data, setData] = useState<Ruangan[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}ruang?page=${page}&pageSize=${pageLimit}&nama=${search}`
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
  }, [page, search, pageLimit]); // Re-fetch data when query changes

  return <RuanganTable columns={columns} data={data} totalItems={totalData} />;
}
