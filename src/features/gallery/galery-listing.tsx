'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable as GalleryTable } from '@/components/ui/table/data-table';
import { columns } from './galery-tables/columns';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';

export type Gallery = {
  id: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default function GalleryListingPage() {
  const [data, setData] = useState<Gallery[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.user?.token;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}gallery`);
        if (response.data && response.data.data) {
          setData(response.data.data);
          setTotalData(response.data.data.length);
        } else {
          setError('Data format is invalid');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching the gallery data');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <GalleryTable columns={columns} data={data} totalItems={totalData} />;
}
