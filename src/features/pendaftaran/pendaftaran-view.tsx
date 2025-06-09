import { API } from '@/lib/server';
import PendaftaranForm from './pendaftaran-form';
import axios from 'axios';

type ID = {
  id: string;
};

export default async function PendaftaranViewPage({ id }: ID) {
  let Pendaftaran = null;
  let pageTitle = 'Pendaftaran Siswa';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}pendaftarab/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const user = await fetchData();
    Pendaftaran = user;
    pageTitle = `Pendaftaran Siswa`;
  }

  return (
    <PendaftaranForm id={id} initialData={Pendaftaran} pageTitle={pageTitle} />
  );
}
