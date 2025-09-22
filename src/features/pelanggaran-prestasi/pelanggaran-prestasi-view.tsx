import PelanggaranPrestasiForm from './pelanggaran-prestasi-form';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDPelanggaranPrestasiType = {
  id: string;
};

export default async function PelanggaranPrestasiViewPage({
  id
}: IDPelanggaranPrestasiType) {
  let PelanggaranPrestasi = null;
  let pageTitle = 'Tambah Pelanggaran Prestasi';

  const session = await auth();
  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`pelanggaran-prestasi/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        return response.data;
      } catch (error: any) {
        console.log(error.response?.data?.message || 'Terjadi kesalahan');
      }
    };

    const res = await fetchData();
    PelanggaranPrestasi = res;
    pageTitle = 'Ubah Pelanggaran Prestasi';
  }

  return (
    <PelanggaranPrestasiForm
      id={id}
      initialData={PelanggaranPrestasi}
      pageTitle={pageTitle}
    />
  );
}
