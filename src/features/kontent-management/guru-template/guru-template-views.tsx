import { API } from '@/lib/server';
import GuruTemplateForm from './guru-tamplate-form';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDGuruTemplateType = {
  id: string;
};

export default async function GuruTemplateViewPage({ id }: IDGuruTemplateType) {
  let GuruTemplateData = null;
  let pageTitle = 'Tambah Guru Template';
  const session = await auth();

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`guru-template/${id}`, {
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

    const guruTemplate = await fetchData();
    GuruTemplateData = guruTemplate;
    pageTitle = `Ubah Guru Template`;
  }

  return (
    <GuruTemplateForm
      id={id}
      initialData={GuruTemplateData}
      pageTitle={pageTitle}
    />
  );
}
