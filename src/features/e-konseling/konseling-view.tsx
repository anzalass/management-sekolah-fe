import { API } from '@/lib/server';
import KonselingForm from './konseling-form';
import axios from 'axios';
import { toast } from 'sonner';

type IDKonselingType = {
  id: string;
};

export default async function KonselingViewPage({ id }: IDKonselingType) {
  let KonselingData = null;
  let pageTitle = 'Tambah Konseling';
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}konseling/${id}`
        );
        return response.data;
      } catch (error) {
        toast.error('Error fetching data');
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
