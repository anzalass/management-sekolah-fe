'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as PerizinanGuruTable } from '@/components/ui/table/data-table';
import { columns } from './perizinan-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import api from '@/lib/api';

export type PerizinanGuru = {
  id: string;
  nipGuru: string;
  keterangan: string;
  time: string; // ISO date string
  bukti: string | null;
  bukti_id: string | null;
  status: 'DITERIMA' | 'DITOLAK' | 'MENUNGGU' | string; // enum atau string bebas
  nama: string | null;
  nip: string | null;
};
export default function PerizinanGuruListingPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nip = searchParams.get('nip') || '';
  const tanggal = searchParams.get('tanggal') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<PerizinanGuru[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `perizinan-guru?page=${page}&pageSize=${pageLimit}&nama=${search}&nip=${nip}&tanggal=${tanggal}`,
          {
            headers: {
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
  }, [page, search, nip, tanggal, trigger, pageLimit]);

  return (
    <PerizinanGuruTable columns={columns} data={data} totalItems={totalData} />
  );
}
