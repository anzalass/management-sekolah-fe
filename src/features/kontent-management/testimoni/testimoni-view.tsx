import { API } from '@/lib/server';
import TestimonialForm from './testimoni-form';
import axios from 'axios';

type IDTestimonialType = {
  id: string;
};

export default async function TestimonialViewPage({ id }: IDTestimonialType) {
  let TestimonialData = null;
  let pageTitle = 'Tambah Testimoni';

  if (id !== 'new') {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}testimonials/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching data:', error);
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
