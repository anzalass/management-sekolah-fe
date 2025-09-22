import { API } from '@/lib/server';
import GalleryForm from './galery-form';
import axios from 'axios';
import api from '@/lib/api';
import { toast } from 'sonner';
import { auth } from '@/lib/auth';

type IDGalleryType = {
  id: string;
};

export default async function GalleryViewPage({ id }: IDGalleryType) {
  let galleryData = null;
  let pageTitle = 'Tambah Gallery';
  const session = await auth();

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`gallery/${id}`, {
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

    const gallery = await fetchData();
    galleryData = gallery;
    pageTitle = 'Ubah Gallery';
  }

  return (
    <GalleryForm id={id} initialData={galleryData} pageTitle={pageTitle} />
  );
}
