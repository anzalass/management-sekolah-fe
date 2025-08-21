import { API } from '@/lib/server';
import axios from 'axios';
import TagihanForm from './daftar-tagihan-form';
import { toast } from 'sonner';

type IDTagiihan = {
  id: string;
};

export default async function DaftarTagihannViewPage({ id }: IDTagiihan) {
  let Tagihan = null;
  let pageTitle = 'Tambah Tagihan';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}pembayaran/${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };
    const user = await fetchData();
    Tagihan = user;
    pageTitle = `Ubah Tagihan ${Tagihan.namaSiswa} - ${Tagihan.nisSiswa}`;
  }

  return <TagihanForm id={id} initialData={Tagihan} pageTitle={pageTitle} />;
}
