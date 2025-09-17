import { API } from '@/lib/server';
import KegiatanSekolahForm from './ruang-form';
import axios from 'axios';
import RuanganForm from './ruang-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDRuang = {
  id: string;
};

export default async function RuanganViewPage({ id }: IDRuang) {
  let Ruang = null;
  let pageTitle = 'Tambah Ruang';
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
    pageTitle = 'Ubah Ruangan';
  }

  return <RuanganForm id={id} initialData={Ruang} pageTitle={pageTitle} />;
}
