'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as DaftarInventaris } from '@/components/ui/table/data-table';
import { columns } from './daftar-inventaris-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { Inventaris } from './daftar-inventaris-form';
import { toast } from 'sonner';

export default function DaftarInventarisListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const waktuPengadaan = searchParams.get('waktuPengadaan') || '';
  const hargaBeli = searchParams.get('hargaBeli') || '';
  const ruang = searchParams.get('ruang') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Inventaris[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}inventaris?page=${page}&pageSize=${pageLimit}&nama=${search}&waktuPengadaan=${waktuPengadaan}&ruang=${ruang}&hargaBeli=${hargaBeli}`
        );
        setData(response.data.data.data);
        setTotalData(response.data.data.count);
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, trigger, pageLimit, waktuPengadaan, hargaBeli, ruang]);

  return (
    <DaftarInventaris columns={columns} data={data} totalItems={totalData} />
  );
}
