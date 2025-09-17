'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as KegiatanSekolahTable } from '@/components/ui/table/data-table';
import { columns } from './kegiatan-sekolah-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export type KegiatanSekolah = {
  id: string;
  nama: string;
  keterangan: string;
  waktuMulai: Date;
  waktuSelesai: Date;
  tahunAjaran: string;
  status: string;
};

export default function KegiatanSekolahListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const ta = searchParams.get('ta') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<KegiatanSekolah[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `kegiatan-sekolah?page=${page}&pageSize=${pageLimit}&nama=${search}&ta=${ta}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.result.data);
        setTotalData(response.data.result.total);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, ta, pageLimit, trigger]); // Re-fetch data when query changes

  return (
    <KegiatanSekolahTable
      columns={columns}
      data={data}
      totalItems={totalData}
    />
  );
}
