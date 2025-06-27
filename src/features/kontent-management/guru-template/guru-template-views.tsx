import { API } from '@/lib/server';
import GuruTemplateForm from './guru-tamplate-form';
import axios from 'axios';

type IDGuruTemplateType = {
  id: string;
};

export default async function GuruTemplateViewPage({ id }: IDGuruTemplateType) {
  let GuruTemplateData = null;
  let pageTitle = 'Tambah Guru Template';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}guru-template/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
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
