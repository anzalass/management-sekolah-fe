import { API } from '@/lib/server';
import KegiatanSekolahForm from './mapel-form';
import axios from 'axios';
import MataPelajaranForm from './mapel-form';

type IDMapel = {
  id: string;
};

export default async function MapelViewPage({ id }: IDMapel) {
  let MataPelajaran = null;
  let pageTitle = 'Tambah Mata Pelajaran';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}mapel/get/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const user = await fetchData();
    MataPelajaran = user;
    pageTitle = 'Ubah Mata Pelajaran';
  }

  return (
    <MataPelajaranForm
      id={id}
      initialData={MataPelajaran}
      pageTitle={pageTitle}
    />
  );
}
