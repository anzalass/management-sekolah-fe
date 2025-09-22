import { API } from '@/lib/server';
import axios from 'axios';
import DaftarInventarisForm from './daftar-inventaris-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDDaftarInventaris = {
  id: string;
};

export default async function DaftarInventarisViewPage({
  id
}: IDDaftarInventaris) {
  let JenisInventaris = null;
  let pageTitle = 'Tambah Daftar Inventaris';
  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`inventaris/get/${id}`, {
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
    <DaftarInventarisForm
      id={id}
      initialData={JenisInventaris}
      pageTitle={pageTitle}
    />
  );
}
