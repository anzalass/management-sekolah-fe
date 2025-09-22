import { API } from '@/lib/server';
import KonselingForm from './konseling-form';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDKonselingType = {
  id: string;
};

export default async function KonselingViewPage({ id }: IDKonselingType) {
  let KonselingData = null;
  const session = await auth();
  let pageTitle = 'Tambah Konseling';
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`konseling/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data;
      } catch (error: any) {
        console.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    };

    const Konseling = await fetchData();
    KonselingData = Konseling;
    pageTitle = 'Ubah Konseling';
  }

  return (
    <KonselingForm id={id} initialData={KonselingData} pageTitle={pageTitle} />
  );
}
