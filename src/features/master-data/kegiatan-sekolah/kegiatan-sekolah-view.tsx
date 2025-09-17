import { API } from '@/lib/server';
import KegiatanSekolahForm from './kegiatan-sekolah-form';
import GuruStaffForm from './kegiatan-sekolah-form';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDKegiatanType = {
  id: string;
};

export default async function KegiatanSekolahViewPage({ id }: IDKegiatanType) {
  let KegiatanSekolah = null;
  let pageTitle = 'Tambah Kegiatan Sekolah';
  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`kegiatan-sekolah/get/${id}`, {
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
    KegiatanSekolah = user;
    pageTitle = `Ubah Kegiatan Sekolah`;
  }

  return (
    <KegiatanSekolahForm
      id={id}
      initialData={KegiatanSekolah}
      pageTitle={pageTitle}
    />
  );
}
