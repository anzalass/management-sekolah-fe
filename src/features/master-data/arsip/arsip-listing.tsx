'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as Arsip } from '@/components/ui/table/data-table';
import { columns } from './arsip-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';

export type Arsip = {
  id: string;
  namaBerkas: string;
  keterangan: string;
  url: string;
};

export default function ArsipListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('namaBerkas') || '';
  const tanggal = searchParams.get('tanggal') || '';
  const keterangan = searchParams.get('keterangan') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Arsip[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}arsip?page=${page}&pageSize=${pageLimit}&namaBerkas=${search}&keterangan=${keterangan}&tanggal=${tanggal}`
        );
        setData(response.data.data);
        setTotalData(response.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, pageLimit]); // Re-fetch data when query changes

  return <Arsip columns={columns} data={data} totalItems={totalData} />;
}
