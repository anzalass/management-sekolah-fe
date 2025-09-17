import { API } from '@/lib/server';
import axios from 'axios';
import ListKelasForm from './list-kelas-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDListKelas = {
  id: string;
};

export default async function ListKelasViewPage({ id }: IDListKelas) {
  let ListKelas = null;
  let pageTitle = 'Tambah List Kelas';
  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`list-kelas/get/${id}`, {
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
    ListKelas = user;
    pageTitle = 'Ubah Riwayat ListKelas';
  }

  return (
    <ListKelasForm id={id} initialData={ListKelas} pageTitle={pageTitle} />
  );
}
