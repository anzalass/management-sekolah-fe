import { API } from '@/lib/server';
import GuruStaffForm from './guru-staff-form';
import axios from 'axios';

type IDGuruType = {
  idGuru: string;
};

export default async function GuruStaffViewPage({ idGuru }: IDGuruType) {
  let GuruStaff = null;
  let pageTitle = 'Tambah Guru dan Staff';

  if (idGuru !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}user/get-guru/${idGuru}`
        );
        return response.data.data;
      } catch (error) {}
    };
    const user = await fetchData();
    GuruStaff = user;
    pageTitle = `Ubah Data Guru / Staff`;
  }

  return (
    <GuruStaffForm
      idGuru={idGuru}
      initialData={GuruStaff}
      pageTitle={pageTitle}
    />
  );
}
