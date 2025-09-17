'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as Arsip } from '@/components/ui/table/data-table';
import { columns } from './arsip-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const [data, setData] = useState<Arsip[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `arsip?page=${page}&pageSize=${pageLimit}&namaBerkas=${search}&keterangan=${keterangan}&tanggal=${tanggal}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data);
        setTotalData(response.data.totalData);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, pageLimit]); // Re-fetch data when query changes

  return <Arsip columns={columns} data={data} totalItems={totalData} />;
}
