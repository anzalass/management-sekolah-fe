import { API } from '@/lib/server';
import axios from 'axios';
import JenisInventarisForm from './jenis-inventaris-form';
import { toast } from 'sonner';

type IDJenisInventaris = {
  id: string;
};

export default async function JenisInventarisViewPage({
  id
}: IDJenisInventaris) {
  let JenisInventaris = null;
  let pageTitle = 'Tambah Jenis Inventaris';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}jenis-inventaris/get/${id}`);
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
    <JenisInventarisForm
      id={id}
      initialData={JenisInventaris}
      pageTitle={pageTitle}
    />
  );
}
