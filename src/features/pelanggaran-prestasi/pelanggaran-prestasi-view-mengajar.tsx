import api from '@/lib/api';
import { auth } from '@/lib/auth';
import PelanggaranPrestasiFormMengajar from './pelanggaran-prestasi-form-mengajar';

type IDPelanggaranPrestasiType = {
  id: string;
};

export default async function PelanggaranPrestasiViewPageMengajar({
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
    <PelanggaranPrestasiFormMengajar
      id={id}
      initialData={PelanggaranPrestasi}
      pageTitle={pageTitle}
    />
  );
}
