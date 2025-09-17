import { API } from '@/lib/server';
import NewsForm from './news-form';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDNewsType = {
  id: string;
};

export default async function NewsViewPage({ id }: IDNewsType) {
  let NewsData = null;
  let pageTitle = 'Tambah Berita';
  const session = await auth();

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`news/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data.data;
      } catch (error: any) {
        console.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    };

    const news = await fetchData();
    NewsData = news;
    pageTitle = `Ubah Berita`;
  }

  return <NewsForm id={id} initialData={NewsData} pageTitle={pageTitle} />;
}
