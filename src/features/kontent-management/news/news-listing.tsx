'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as NewsTable } from '@/components/ui/table/data-table';
import { columns } from './news-tables/column';
import { API } from '@/lib/server';
import { useSearchParams } from 'next/navigation';

export type News = {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default function NewsListingPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const pageLimit = searchParams.get('limit') || '10';

  const [data, setData] = useState<News[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}news?page=${page}&pageSize=${pageLimit}&search=${search}`
        );
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.total);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching the news data');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, pageLimit, search]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <NewsTable columns={columns} data={data} totalItems={totalData} />;
}
