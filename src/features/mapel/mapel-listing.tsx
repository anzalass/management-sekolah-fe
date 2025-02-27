'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as RuanganTable } from '@/components/ui/table/data-table';
import { columns } from './mapel-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';

export type Mapel = {
  id: string;
  nama: string;
  kelas: string;
};

export default function MapelListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Mapel[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}mapel?page=${page}&pageSize=${pageLimit}&nama=${search}`
        );
        setData(response.data.result.data);
        setTotalData(response.data.result.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, pageLimit]); // Re-fetch data when query changes

  return <RuanganTable columns={columns} data={data} totalItems={totalData} />;
}
