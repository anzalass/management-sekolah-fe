'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as BukuTable } from '@/components/ui/table/data-table';

import { useSearchParams } from 'next/navigation';
import { Buku, columns } from './buku-tables/columns';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { columnsMengajar } from './buku-tables/columns-mengajar';

export default function BukuListingPageMengajar() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const pengarang = searchParams.get('pengarang') || '';
  const penerbit = searchParams.get('penerbit') || '';
  const tahunTerbit = searchParams.get('tahunTerbit') || '';
  const pageLimit = searchParams.get('limit') || '10';
  const { data: session } = useSession();

  const [data, setData] = useState<Buku[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuku = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `buku?page=${page}&pageSize=${pageLimit}&nama=${search}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        if (response.data) {
          setData(response.data.data);
          setTotalData(response.data.pagination.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        setError('Terjadi kesalahan saat mengambil data buku');
      } finally {
        setLoading(false);
      }
    };

    fetchBuku();
  }, [page, pageLimit, search, pengarang, penerbit, tahunTerbit]);

  return (
    <BukuTable columns={columnsMengajar} data={data} totalItems={totalData} />
  );
}
