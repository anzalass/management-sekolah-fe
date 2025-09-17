import { API } from '@/lib/server';
import GuruStaffForm from './guru-staff-form';
import axios from 'axios';
import api from '@/lib/api';
import { toast } from 'sonner';
import { auth } from '@/lib/auth';

type IDGuruType = {
  idGuru: string;
};

export default async function GuruStaffViewPage({ idGuru }: IDGuruType) {
  let GuruStaff = null;
  let pageTitle = 'Tambah Guru dan Staff';
  const session = await auth();

  if (idGuru !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`user/get-guru/${idGuru}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data.data;
      } catch (error: any) {
        console.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
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
