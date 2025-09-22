'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as TestimonialTable } from '@/components/ui/table/data-table';
import { columns } from './testimoni-tables/columns';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

// Type for Testimonial
export type Testimonial = {
  id: string;
  description: string;
  parentName: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default function TestimonialListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const pageLimit = searchParams.get('limit') || '10';
  const [data, setData] = useState<Testimonial[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `testimonials?page=${page}&pageSize=${pageLimit}&search=${search}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.data.length);
        } else {
          setError('Data format is invalid');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        setError('An error occurred while fetching the testimonial data');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [page, pageLimit, trigger, search]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TestimonialTable columns={columns} data={data} totalItems={totalData} />
  );
}
