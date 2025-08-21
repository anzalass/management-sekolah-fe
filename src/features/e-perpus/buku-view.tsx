import { API } from '@/lib/server';
import axios from 'axios';
import BukuForm from './data-buku-form';

type IDBukuType = {
  id: string;
};

export default async function BukuViewPage({ id }: IDBukuType) {
  let BukuData = null;
  let pageTitle = 'Tambah Buku';
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}Buku/${id}`
        );
        return response.data.data;
      } catch (error) {
        toast.error('Error fetching data:', error);
      }
    };

    const buku = await fetchData();
    BukuData = buku;
    pageTitle = 'Ubah buku';
  }

  return <BukuForm id={id} initialData={BukuData} pageTitle={pageTitle} />;
}
