import { API } from '@/lib/server';
import PelanggaranPrestasiForm from './pelanggaran-prestasi-form';
import axios from 'axios';
import { toast } from 'sonner';

type IDPelanggaranPrestasiType = {
  id: string;
};

export default async function PelanggaranPrestasiViewPage({
  id
}: IDPelanggaranPrestasiType) {
  let PelanggaranPrestasi = null;
  let pageTitle = 'Tambah PelanggaranPrestasi';
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}pelanggaran-prestasi/${id}`
        );
        return response.data;
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    const pelanggaranPrestasi = await fetchData();
    PelanggaranPrestasi = pelanggaranPrestasi;
    pageTitle = 'Ubah PelanggaranPrestasi';
  }

  return (
    <PelanggaranPrestasiForm
      id={id}
      initialData={PelanggaranPrestasi}
      pageTitle={pageTitle}
    />
  );
}
