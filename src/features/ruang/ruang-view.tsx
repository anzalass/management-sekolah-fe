import { API } from '@/lib/server';
import KegiatanSekolahForm from './ruang-form';
import axios from 'axios';
import RuanganForm from './ruang-form';

type IDRuang = {
  id: string;
};

export default async function RuanganViewPage({ id }: IDRuang) {
  let Ruang = null;
  let pageTitle = 'Tambah Ruang';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}ruang/get/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const user = await fetchData();
    Ruang = user;
    pageTitle = 'Ubah Ruangan';
  }

  return <RuanganForm id={id} initialData={Ruang} pageTitle={pageTitle} />;
}
