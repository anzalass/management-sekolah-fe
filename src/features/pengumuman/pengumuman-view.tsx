import { API } from '@/lib/server';
import axios from 'axios';
import AnggaranForm from './pengumuman-form';

type IDAnggaran = {
  id: string;
};

export default async function PengumumanViewPage({ id }: IDAnggaran) {
  let Pengumuman = null;
  let pageTitle = 'Tambah Pengumuman';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}anggaran/get/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const user = await fetchData();
    Pengumuman = user;
    pageTitle = 'Ubah Pengumuman';
  }

  return (
    <AnggaranForm id={id} initialData={Pengumuman} pageTitle={pageTitle} />
  );
}
