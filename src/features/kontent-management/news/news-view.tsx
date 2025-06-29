import { API } from '@/lib/server';
import NewsForm from './news-form';
import axios from 'axios';

type IDNewsType = {
  id: string;
};

export default async function NewsViewPage({ id }: IDNewsType) {
  let NewsData = null;
  let pageTitle = 'Tambah Berita';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}news/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const news = await fetchData();
    NewsData = news;
    pageTitle = `Ubah Berita`;
  }

  return <NewsForm id={id} initialData={NewsData} pageTitle={pageTitle} />;
}
