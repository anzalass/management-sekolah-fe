'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as DaftarInventaris } from '@/components/ui/table/data-table';
import { columns } from './inventaris-masuk-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { Inventaris } from './daftar-inventaris-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function InventarisMasukListingPage() {
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
  const { data: session } = useSession();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `inventaris?page=${page}&pageSize=${pageLimit}&nama=${search}&waktuPengadaan=${waktuPengadaan}&ruang=${ruang}&hargaBeli=${hargaBeli}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data.data);
        setTotalData(response.data.data.count);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
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
