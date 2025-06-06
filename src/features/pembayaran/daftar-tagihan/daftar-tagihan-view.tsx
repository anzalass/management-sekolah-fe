import { API } from '@/lib/server';
import axios from 'axios';
import PengumumanForm from './pengumuman-form';

type IDPengumuman = {
  id: string;
};

export default async function DaftarTagihannViewPage({ id }: IDPengumuman) {
  let Pengumuman = null;
  let pageTitle = 'Tambah Pengumuman';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}pengumuman/get/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
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
