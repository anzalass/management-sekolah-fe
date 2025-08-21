'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as BukuTable } from '@/components/ui/table/data-table';

import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { columns, Peminjaman } from './peminjaman-pengembalian-tables/columns';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';

export default function PeminjamanPengembalianListingPage() {
  const { trigger, toggleTrigger } = useRenderTrigger();

  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const status = searchParams.get('status') || '';

  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Peminjaman[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuku = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}peminjaman?page=${page}&pageSize=${pageLimit}&nama=${search}&status=${status}`
        );
        if (response.data) {
          setData(response.data.data);
          setTotalData(response.data.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        toast.error('Error fetching data');
        setError('Terjadi kesalahan saat mengambil data buku');
      } finally {
        setLoading(false);
      }
    };

    fetchBuku();
  }, [page, pageLimit, search, trigger]);

  return <BukuTable columns={columns} data={data} totalItems={totalData} />;
}
