import { API } from '@/lib/server';
import axios from 'axios';
import ArsipForm from './arsip-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDArsip = {
  id: string;
};

export default async function ArsipViewPage({ id }: IDArsip) {
  let Ruang = null;
  let pageTitle = 'Tambah Arsip';
  const session = await auth();

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`ruang/get/${id}`, {
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
    Ruang = user;
    pageTitle = 'Ubah Arsip';
  }

  return <ArsipForm id={id} initialData={Ruang} pageTitle={pageTitle} />;
}
