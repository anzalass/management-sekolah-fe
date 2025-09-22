'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as PengumumanTable } from '@/components/ui/table/data-table';
import { columns } from './pengumuman-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { Pengumuman } from './pengumuman-form';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `pengumuman?page=${page}&pageSize=${pageLimit}&title=${search}&time=${tanggal}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data);
        setTotalData(response.data.totaData);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
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
