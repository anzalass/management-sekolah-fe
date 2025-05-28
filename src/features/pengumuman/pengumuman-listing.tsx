'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as PengumumanTable } from '@/components/ui/table/data-table';
import { columns } from './pengumuman-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { Pengumuman } from './pengumuman-form';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

export default function PengumumanListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const jenis = searchParams.get('jenis') || '';
  const tanggal = searchParams.get('tanggal') || '';
  const jumlah = searchParams.get('jumlah') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Pengumuman[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}pengumuman?page=${page}&pageSize=${pageLimit}&title=${search}&time=${tanggal}`
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
  }, [page, search, jumlah, tanggal, trigger, jenis, pageLimit]);

  return (
    <PengumumanTable columns={columns} data={data} totalItems={totalData} />
  );
}
