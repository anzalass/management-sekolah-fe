import { API } from '@/lib/server';
import TestimonialForm from './testimoni-form';
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';
import { auth } from '@/lib/auth';

type IDTestimonialType = {
  id: string;
};

export default async function TestimonialViewPage({ id }: IDTestimonialType) {
  let TestimonialData = null;
  let pageTitle = 'Tambah Testimoni';
  const session = await auth();

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await api.get(`testimonials/${id}`, {
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

    const testimonial = await fetchData();
    TestimonialData = testimonial;
    pageTitle = `Ubah Testimoni`;
  }

  return (
    <TestimonialForm
      id={id}
      initialData={TestimonialData}
      pageTitle={pageTitle}
    />
  );
}
