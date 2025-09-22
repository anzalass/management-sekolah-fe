import { API } from '@/lib/server';
import PendaftaranForm from './pendaftaran-form';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { auth } from '@/lib/auth';

type IDPendaftaranType = {
  id: string;
};

export default async function PendaftaranViewPage({ id }: IDPendaftaranType) {
  let PendaftaranData = null;
  let pageTitle = 'Tambah Pendaftaran';
  if (id !== 'new') {
    const fetchData = async () => {
      const session = await auth();
      try {
        const response = await api.get(`pendaftaran/${id}`, {
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

    const pendaftaran = await fetchData();
    PendaftaranData = pendaftaran;
    pageTitle = 'Ubah Pendaftaran';
  }

  return (
    <PendaftaranForm
      id={id}
      initialData={PendaftaranData}
      pageTitle={pageTitle}
    />
  );
}
