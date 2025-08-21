import { API } from '@/lib/server';
import axios from 'axios';
import PinjamBukuForm from './peminjaman-pengembalian-form';
import { toast } from 'sonner';

type IDBukuType = {
  id: string;
};

export default async function PeminjamanPengembalianForm({ id }: IDBukuType) {
  let BukuData = null;
  let pageTitle = 'Tambah Buku';
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}Buku/${id}`
        );
        return response.data.data;
      } catch (error) {
        toast.error('Error fetching data:');
      }
    };

    const buku = await fetchData();
    BukuData = buku;
    pageTitle = 'Ubah buku';
  }

  return <PinjamBukuForm pageTitle={pageTitle} />;
}
