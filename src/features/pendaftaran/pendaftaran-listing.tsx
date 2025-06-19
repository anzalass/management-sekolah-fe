'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as PendaftaranTable } from '@/components/ui/table/data-table';
import { columns } from './pendaftaran-tables/columns';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';

export type Pendaftaran = {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phoneNumber: string;
  yourLocation: string;
  createdAt: string;
  updatedAt: string;
};

export default function PendaftaranListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<Pendaftaran[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendaftaran = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}pendaftaran?page=${page}&pageSize=${pageLimit}&search=${search}`
        );
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching the registration data');
      } finally {
        setLoading(false);
      }
    };

    fetchPendaftaran();
  }, [page, pageLimit, search]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PendaftaranTable columns={columns} data={data} totalItems={totalData} />
  );
}
