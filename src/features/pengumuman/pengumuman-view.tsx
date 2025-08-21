import { API } from '@/lib/server';
import axios from 'axios';
import PengumumanForm from './pengumuman-form';
import { toast } from 'sonner';

type IDPengumuman = {
  id: string;
};

export default async function PengumumanViewPage({ id }: IDPengumuman) {
  let Pengumuman = null;
  let pageTitle = 'Tambah Pengumuman';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}pengumuman/get/${id}`
        );
        return response.data;
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    const user = await fetchData();
    Pengumuman = user;
    pageTitle = 'Ubah Pengumuman';
  }

  return (
    <PengumumanForm id={id} initialData={Pengumuman} pageTitle={pageTitle} />
  );
}
