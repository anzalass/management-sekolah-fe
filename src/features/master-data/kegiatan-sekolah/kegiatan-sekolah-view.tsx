import { API } from '@/lib/server';
import KegiatanSekolahForm from './kegiatan-sekolah-form';
import GuruStaffForm from './kegiatan-sekolah-form';
import axios from 'axios';

type IDKegiatanType = {
  id: string;
};

export default async function KegiatanSekolahViewPage({ id }: IDKegiatanType) {
  let KegiatanSekolah = null;
  let pageTitle = 'Tambah Kegiatan Sekolah';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}kegiatan-sekolah/get/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const user = await fetchData();
    KegiatanSekolah = user;
    pageTitle = `Ubah Kegiatan Sekolah`;
  }

  return (
    <KegiatanSekolahForm
      id={id}
      initialData={KegiatanSekolah}
      pageTitle={pageTitle}
    />
  );
}
