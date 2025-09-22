import { API } from '@/lib/server';
import axios from 'axios';
import AnggaranForm from './anggaran-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDAnggaran = {
  id: string;
};

export default async function AnggaranViewPage({ id }: IDAnggaran) {
  let Anggarana = null;
  let pageTitle = 'Tambah Riwayat Anggaran';
  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`anggaran/get/${id}`, {
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
    Anggarana = user;
    pageTitle = 'Ubah Riwayat Anggaran';
  }

  return <AnggaranForm id={id} initialData={Anggarana} pageTitle={pageTitle} />;
}
