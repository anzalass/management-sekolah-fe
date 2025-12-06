import SiswaForm from './siswa-form';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type NisType = {
  nis: string;
};

export default async function SiswaViewPage({ nis }: NisType) {
  let GuruStaff = null;
  let pageTitle = 'Tambah Siswa';

  if (nis !== 'new') {
    const session = await auth();
    const fetchData = async () => {
      try {
        const response = await api.get(`user/get-siswa/${nis}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data.data;
      } catch (error: any) {
        console.log(error.response?.data?.message || 'Terjadi kesalahan');
      }
    };
    const user = await fetchData();
    GuruStaff = user;
    pageTitle = `Ubah Data Siswa`;
  }

  return <SiswaForm nis={nis} initialData={GuruStaff} pageTitle={pageTitle} />;
}
