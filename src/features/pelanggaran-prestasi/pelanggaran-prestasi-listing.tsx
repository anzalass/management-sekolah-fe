'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as PelanggaranPrestasiTable } from '@/components/ui/table/data-table';
import {
  columns,
  PelanggaranPrestasi
} from './pelanggaran-predtasi-tables/columns';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function PelanggaranPrestasiListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('nama') || '';
  const nis = searchParams.get('nis') || '';
  const tanggal = searchParams.get('waktu') || '';
  const jenis = searchParams.get('jenis') || '';

  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<PelanggaranPrestasi[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPelanggaranPrestasi = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}pelanggaran-prestasi?page=${page}&pageSize=${pageLimit}&nama=${search}&nis=${nis}&waktu=${tanggal}&jenis=${jenis}`
        );
        if (response.data) {
          setData(response.data.result.data);
          setTotalData(response.data.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        toast.error('Error fetching data');
        setError('An error occurred while fetching the registration data');
      } finally {
        setLoading(false);
      }
    };

    fetchPelanggaranPrestasi();
  }, [page, pageLimit, search, tanggal, jenis, nis]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PelanggaranPrestasiTable columns={columns} data={data} totalItems={0} />
  );
}
