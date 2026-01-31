import HariLiburForm from './hari-libur-form';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDArsip = {
  id: string;
};

export default async function HariLiburViewPage({ id }: IDArsip) {
  let HariLibur = null;
  let pageTitle = 'Tambah Hari Libur';
  const session = await auth();

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`hari-libur/${id}`, {
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
    HariLibur = user;
    pageTitle = 'Ubah Hari Libur';
  }

  return (
    <HariLiburForm id={id} initialData={HariLibur} pageTitle={pageTitle} />
  );
}
