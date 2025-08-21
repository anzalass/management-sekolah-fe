'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as KegiatanSekolahTable } from '@/components/ui/table/data-table';
import { columns } from './kegiatan-sekolah-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';

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

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}kegiatan-sekolah?page=${page}&pageSize=${pageLimit}&nama=${search}&ta=${ta}`
        );
        setData(response.data.result.data);
        setTotalData(response.data.result.total);
      } catch (error) {
        toast.error('Error fetching data');
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
