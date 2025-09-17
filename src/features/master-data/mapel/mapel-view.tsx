import { API } from '@/lib/server';
import KegiatanSekolahForm from './mapel-form';
import axios from 'axios';
import MataPelajaranForm from './mapel-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDMapel = {
  id: string;
};

export default async function MapelViewPage({ id }: IDMapel) {
  let MataPelajaran = null;
  let pageTitle = 'Tambah Mata Pelajaran';
  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`mapel/get/${id}`, {
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
    MataPelajaran = user;
    pageTitle = 'Ubah Mata Pelajaran';
  }

  return (
    <MataPelajaranForm
      id={id}
      initialData={MataPelajaran}
      pageTitle={pageTitle}
    />
  );
}
