import { API } from '@/lib/server';
import axios from 'axios';
import PengumumanForm from './pengumuman-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth'; // atau getServerSession kalau pakai NextAuth
type IDPengumuman = {
  id: string;
};

export default async function PengumumanViewPage({ id }: IDPengumuman) {
  let Pengumuman = null;
  let pageTitle = 'Tambah Pengumuman';

  if (id !== 'new') {
    const session = await auth();
    const fetchData = async () => {
      try {
        const response = await api.get(`pengumuman/get/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data;
      } catch (error: any) {
        console.log(error.response?.data?.message || 'Terjadi kesalahan');
      }
    };
    const user = await fetchData();
    Pengumuman = user;
    pageTitle = 'Ubah Pengumuman';
  }

  return (
    <PengumumanForm id={id} initialData={Pengumuman} pageTitle={pageTitle} />
  );
}
