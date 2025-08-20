import { API } from '@/lib/server';
import axios from 'axios';
import DaftarInventarisForm from './daftar-inventaris-form';
import { toast } from 'sonner';

type IDDaftarInventaris = {
  id: string;
};

export default async function DaftarInventarisViewPage({
  id
}: IDDaftarInventaris) {
  let JenisInventaris = null;
  let pageTitle = 'Tambah Daftar Inventaris';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}inventaris/get/${id}`);
        return response.data.data;
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    const user = await fetchData();
    JenisInventaris = user;
    pageTitle = 'Ubah Jenis Inventaris';
  }

  return (
    <DaftarInventarisForm
      id={id}
      initialData={JenisInventaris}
      pageTitle={pageTitle}
    />
  );
}
