'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as DaftarInventaris } from '@/components/ui/table/data-table';
import {
  columns,
  PemeliharaanInventaris
} from './daftar-pemeliharaan-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

export default function DaftarPemeliharaanInventarisListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const waktuPengadaan = searchParams.get('waktuPengadaan') || '';
  const hargaBeli = searchParams.get('hargaBeli') || '';
  const ruang = searchParams.get('ruang') || '';
  const status = searchParams.get('status') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<PemeliharaanInventaris[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}pemeliharaan-inventaris?page=${page}&pageSize=${pageLimit}&nama=${search}&tanggal=${waktuPengadaan}&ruang=${ruang}&hargaBeli=${hargaBeli}&status=${status}`
        );
        setData(response.data.data.data);
        setTotalData(response.data.data.totalData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [
    page,
    search,
    trigger,
    pageLimit,
    waktuPengadaan,
    hargaBeli,
    ruang,
    status
  ]);

  return (
    <DaftarInventaris columns={columns} data={data} totalItems={totalData} />
  );
}
