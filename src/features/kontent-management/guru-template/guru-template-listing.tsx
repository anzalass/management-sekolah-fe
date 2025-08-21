'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as GuruTemplateTable } from '@/components/ui/table/data-table';
import { columns } from './guru-template-tables/column';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

export type GuruTemplate = {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default function GuruTemplateListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const pageLimit = searchParams.get('limit') || '10';
  const { trigger, toggleTrigger } = useRenderTrigger();

  const [data, setData] = useState<GuruTemplate[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuruTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}guru-template?page=${page}&pageSize=${pageLimit}&search=${search}`
        );
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        toast.error('Error fetching data');
        setError('An error occurred while fetching the guru template data');
      } finally {
        setLoading(false);
      }
    };

    fetchGuruTemplates();
  }, [page, pageLimit, search, trigger]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <GuruTemplateTable
      columns={columns} // Make sure you adjust columns for GuruTemplate
      data={data}
      totalItems={totalData}
    />
  );
}
