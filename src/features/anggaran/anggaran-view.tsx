import { API } from '@/lib/server';
import KegiatanSekolahForm from './anggaran-form';
import axios from 'axios';
import RuanganForm from './anggaran-form';
import AnggaranForm from './anggaran-form';

type IDAnggaran = {
  id: string;
};

export default async function AnggaranViewPage({ id }: IDAnggaran) {
  let Ruang = null;
  let pageTitle = 'Tambah Riwayat Anggaran';

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
    pageTitle = 'Ubah Riwayat Anggaran';
  }

  return <AnggaranForm id={id} initialData={Ruang} pageTitle={pageTitle} />;
}
