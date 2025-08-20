'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as RiwayatPembayaranTable } from '@/components/ui/table/data-table';
import {
  columns,
  RiwayatPembayaran
} from './riwayat-pembayaran-tables/columns';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';

export default function RiwayatPembayaranListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const namaSiswa = searchParams.get('namaSiswa') || '';
  const waktu = searchParams.get('waktu') || '';
  const nisSiswa = searchParams.get('nisSiswa') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<RiwayatPembayaran[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}riwayat-pembayaran?page=${page}&pageSize=${pageLimit}&namaTagihan=${search}&namaSiswa=${namaSiswa}&waktu=${waktu}&nisSiswa=${nisSiswa}`
        );
        setData(response.data.result.data);
        setTotalData(response.data.total);
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, search, trigger, pageLimit, namaSiswa, nisSiswa, waktu]);

  return (
    <RiwayatPembayaranTable
      columns={columns}
      data={data}
      totalItems={totalData}
    />
  );
}
