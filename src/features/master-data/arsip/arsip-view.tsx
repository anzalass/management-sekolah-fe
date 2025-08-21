import { API } from '@/lib/server';
import axios from 'axios';
import ArsipForm from './arsip-form';
import { toast } from 'sonner';

type IDArsip = {
  id: string;
};

export default async function ArsipViewPage({ id }: IDArsip) {
  let Ruang = null;
  let pageTitle = 'Tambah Arsip';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}ruang/get/${id}`
        );
        return response.data;
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    const user = await fetchData();
    Ruang = user;
    pageTitle = 'Ubah Arsip';
  }

  return <ArsipForm id={id} initialData={Ruang} pageTitle={pageTitle} />;
}
