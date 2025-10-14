import { API } from '@/lib/server';
import axios from 'axios';
import PinjamBukuForm from './peminjaman-pengembalian-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';
import PinjamBukuFormMengajar from './peminjaman-pengembalian-form-mengajar';

type IDBukuType = {
  id: string;
};

export default async function PeminjamanPengembalianFormMengajar({
  id
}: IDBukuType) {
  let BukuData = null;
  let pageTitle = 'Tambah Buku';
  if (id !== 'new') {
    const session = await auth();
    const fetchData = async () => {
      try {
        const response = await api.get(`Buku/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data.data;
      } catch (error: any) {
        console.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    };

    const buku = await fetchData();
    BukuData = buku;
    pageTitle = 'Ubah buku';
  }

  return <PinjamBukuFormMengajar pageTitle={pageTitle} />;
}
