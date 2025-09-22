import { API } from '@/lib/server';
import axios from 'axios';
import JenisInventarisForm from './jenis-inventaris-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDJenisInventaris = {
  id: string;
};

export default async function JenisInventarisViewPage({
  id
}: IDJenisInventaris) {
  let JenisInventaris = null;
  let pageTitle = 'Tambah Jenis Inventaris';
  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`jenis-inventaris/get/${id}`, {
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
    JenisInventaris = user;
    pageTitle = 'Ubah Jenis Inventaris';
  }

  return (
    <JenisInventarisForm
      id={id}
      initialData={JenisInventaris}
      pageTitle={pageTitle}
    />
  );
}
