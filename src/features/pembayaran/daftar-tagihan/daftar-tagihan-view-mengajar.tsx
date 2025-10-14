import api from '@/lib/api';
import { auth } from '@/lib/auth';
import TagihanFormMengajar from './daftar-tagihan-form-mengajar';

type IDTagiihan = {
  id: string;
};

export default async function DaftarTagihannViewPageMengajar({
  id
}: IDTagiihan) {
  let Tagihan = null;
  let pageTitle = 'Tambah Tagihan';

  if (id !== 'new') {
    const session = await auth();
    const fetchData = async () => {
      try {
        const response = await api.get(`pembayaran/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });

        return response.data;
      } catch (error: any) {
        console.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    };
    const user = await fetchData();
    Tagihan = user;
    pageTitle = `Ubah Tagihan ${Tagihan.namaSiswa} - ${Tagihan.nisSiswa}`;
  }

  return (
    <TagihanFormMengajar id={id} initialData={Tagihan} pageTitle={pageTitle} />
  );
}
