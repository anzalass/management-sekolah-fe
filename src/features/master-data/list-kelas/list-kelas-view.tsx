import { API } from '@/lib/server';
import axios from 'axios';
import ListKelasForm from './list-kelas-form';
import { toast } from 'sonner';

type IDListKelas = {
  id: string;
};

export default async function ListKelasViewPage({ id }: IDListKelas) {
  let ListKelas = null;
  let pageTitle = 'Tambah List Kelas';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}list-kelas/get/${id}`);
        return response.data.data;
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    const user = await fetchData();
    ListKelas = user;
    pageTitle = 'Ubah Riwayat ListKelas';
  }

  return (
    <ListKelasForm id={id} initialData={ListKelas} pageTitle={pageTitle} />
  );
}
