'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as TagihanTable } from '@/components/ui/table/data-table';
import { columns, Tagihan } from './daftar-tagihan-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { columnsMengajar } from './daftar-tagihan-tables/columns-mengajar';

export default function TagihanListingPageMengajar() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const namaSiswa = searchParams.get('namaSiswa') || '';
  const waktu = searchParams.get('waktu') || '';
  const nisSiswa = searchParams.get('nisSiswa') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Tagihan[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `pembayaran?page=${page}&pageSize=${pageLimit}&nama=${search}&namaSiswa=${namaSiswa}&waktu=${waktu}&nis=${nisSiswa}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data);
        setTotalData(response.data.total);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, trigger, pageLimit, namaSiswa, nisSiswa, waktu]);

  return (
    <TagihanTable
      columns={columnsMengajar}
      data={data}
      totalItems={totalData}
    />
  );
}
