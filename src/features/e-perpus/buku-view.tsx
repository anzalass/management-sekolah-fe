import { API } from '@/lib/server';
import axios from 'axios';
import BukuForm from './data-buku-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { auth } from '@/lib/auth';

type IDBukuType = {
  id: string;
};

export default async function BukuViewPage({ id }: IDBukuType) {
  let BukuData = null;
  let pageTitle = 'Tambah Buku';
  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`Buku/${id}`, {
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

    const buku = await fetchData();
    BukuData = buku;
    pageTitle = 'Ubah buku';
  }

  return <BukuForm id={id} initialData={BukuData} pageTitle={pageTitle} />;
}
