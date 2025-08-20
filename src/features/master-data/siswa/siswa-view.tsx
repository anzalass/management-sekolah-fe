import { API } from '@/lib/server';
import SiswaForm from './siswa-form';
import GuruStaffForm from './siswa-form';
import axios from 'axios';
import { toast } from 'sonner';

type NisType = {
  nis: string;
};

export default async function SiswaViewPage({ nis }: NisType) {
  let GuruStaff = null;
  let pageTitle = 'Tambah Siswa';

  if (nis !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}user/get-siswa/${nis}`);
        return response.data.data;
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    const user = await fetchData();
    GuruStaff = user;
    pageTitle = `Ubah Data Siswa`;
  }

  return <SiswaForm nis={nis} initialData={GuruStaff} pageTitle={pageTitle} />;
}
