import { API } from '@/lib/server';
import PendaftaranForm from './pendaftaran-form';
import axios from 'axios';
import { toast } from 'sonner';

type IDPendaftaranType = {
  id: string;
};

export default async function PendaftaranViewPage({ id }: IDPendaftaranType) {
  let PendaftaranData = null;
  let pageTitle = 'Tambah Pendaftaran';
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}pendaftaran/${id}`);
        return response.data.data;
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    const pendaftaran = await fetchData();
    PendaftaranData = pendaftaran;
    pageTitle = 'Ubah Pendaftaran';
  }

  return (
    <PendaftaranForm
      id={id}
      initialData={PendaftaranData}
      pageTitle={pageTitle}
    />
  );
}
