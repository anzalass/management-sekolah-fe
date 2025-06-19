import { API } from '@/lib/server';
import axios from 'axios';
import AnggaranForm from './mengajar-form';

type IDAnggaran = {
  id: string;
};

export default async function AnggaranViewPage({ id }: IDAnggaran) {
  let Anggarana = null;
  let pageTitle = 'Tambah Riwayat Anggaran';

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
    Anggarana = user;
    pageTitle = 'Ubah Riwayat Anggaran';
  }

  return <AnggaranForm id={id} initialData={Anggarana} pageTitle={pageTitle} />;
}
