'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as TestimonialTable } from '@/components/ui/table/data-table';
import { columns } from './testimoni-tables/columns';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';

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

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}testimonials?page=${page}&pageSize=${pageLimit}&search=${search}`
        );
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.data.length);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching the testimonial data');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [page, pageLimit, search]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TestimonialTable columns={columns} data={data} totalItems={totalData} />
  );
}
