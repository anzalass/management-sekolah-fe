import { API } from '@/lib/server';
import GalleryForm from './galery-form';
import axios from 'axios';

type IDGalleryType = {
  id: string;
};

export default async function GalleryViewPage({ id }: IDGalleryType) {
  let galleryData = null;
  let pageTitle = 'Tambah Gallery';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}gallery/${id}`);
        return response.data.data;
      } catch (error) {
        toast.error('Error fetching data:', error);
      }
    };

    const gallery = await fetchData();
    galleryData = gallery;
    pageTitle = 'Ubah Gallery';
  }

  return (
    <GalleryForm id={id} initialData={galleryData} pageTitle={pageTitle} />
  );
}
