'use client';
import { useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import Navbar from '../layout/navbar';
import Garis from '../../../public/Garis.png';
import Footer from '../layout/footer';
import 'swiper/css';
import 'swiper/css/navigation';
import banner1 from '../../../public/background.png';
import banner2 from '../../../public/event1.jpg';
import banner3 from '../../../public/event2.jpg';
import Image from 'next/image';
import { toast } from 'sonner';
import api from '@/lib/api';
import Jumbotron from './jumbotron';
import { AboutUs } from './about-us';
import { VisionAndMission } from './visimisi';
import OurClass from './ourclass';
import { WhyLittleAlley } from './whylittlealley';
import { CurriculumSection } from './curriculum';
import OurFacilities from './ourfacilities';
import Gallery from './gallery';
import Testimonial from './testimonial';
import { useQuery } from '@tanstack/react-query';
import child1 from '../../../public/childs1.jpg';
import child2 from '../../../public/childs2.jpg';
import child3 from '../../../public/childs3.jpg';
import lapanak1 from '../../../public/lap-anak1.png';
import lapanak2 from '../../../public/lap-anak2.png';
import Fasilitas1 from '../../../public/fasilitas1.jpg';
import Fasilitas2 from '../../../public/fasilitas2.jpg';
import Fasilitas3 from '../../../public/fasilitas3.jpg';
import Fasilitas4 from '../../../public/fasilitas4.jpg';
import Fasilitas5 from '../../../public/fasilitas5.jpg';
import Fasilitas6 from '../../../public/fasilitas6.jpg';
import Fasilitas8 from '../../../public/fasilitas7.jpg';

const fadeIn = (direction = 'up', delay = 0) => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
    y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: 'easeInOut'
    }
  }
});

export default function Lap() {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const fasilitasImages = [
    { src: Fasilitas1, alt: 'Facility 1' },
    { src: Fasilitas2, alt: 'Facility 2' },
    { src: Fasilitas3, alt: 'Facility 3' },
    { src: Fasilitas4, alt: 'Facility 4' },
    { src: Fasilitas5, alt: 'Facility 5' },
    { src: Fasilitas6, alt: 'Facility 6' },
    { src: Fasilitas8, alt: 'Facility 8' }
  ];

  const whyItems = [
    {
      src: lapanak1,
      alt: 'Inclusive Teaching Approach',
      title: 'Inclusive Teaching Approach',
      desc: `We use a variety of teaching methods and become facilitators for
             students with diverse characters — providing equal opportunities
             and strong foundations for lifelong learning.`
    },
    {
      src: lapanak2,
      alt: 'Holistic Curriculum',
      title: 'Holistic Curriculum',
      desc: `Our preschool program blends play-based and thematic learning
             with hands-on activities. We nurture literacy, numeracy, social
             skills, and creativity through an integrated curriculum.`
    }
  ];

  const facilities = [
    'Spacious and Safe Learning Environment',
    'Well-Equipped Classrooms',
    'Library and Resource Center',
    'Playgrounds and Sports Facilities'
  ];

  const images = [child1, child2, child3];
  // Intersection observer animation
  const [refAbout, inViewAbout] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [refVision, inViewVision] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [refWhy, inViewWhy] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [refCurriculum, inViewCurriculum] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const slides = useMemo(() => [banner1, banner2, banner3], []);

  const [showAbout, setShowAbout] = useState(false);
  const [showVision, setShowVision] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    if (inViewAbout) setShowAbout(true);
    if (inViewVision) setShowVision(true);
    if (inViewWhy) setShowWhy(true);
  }, [inViewAbout, inViewVision, inViewWhy]);

  // 🔹 Fetch data pakai React Query
  const {
    data: testimonials,
    isLoading: isLoadingTestimonials,
    isError: isErrorTestimonials
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const res = await api.get('testimonials');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5 // cache 5 menit
  });

  const {
    data: gallery,
    isLoading: isLoadingGallery,
    isError: isErrorGallery
  } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const res = await api.get('gallery');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5
  });

  // 🔹 Handle error
  useEffect(() => {
    if (isErrorGallery) toast.error('Gagal mengambil data gallery');
    if (isErrorTestimonials) toast.error('Gagal mengambil data testimonial');
  }, [isErrorGallery, isErrorTestimonials]);

  return (
    <div className='lap md:overflow-x-hidden'>
      <Navbar />
      <Jumbotron
        banner={banner1}
        content='Active, Curious & Creative Learning for Future Leaders'
        title1='🎓  Learning Excellence'
        title2='Little Alley'
        title3='Preschool'
      />
      <div className='w-full bg-[#bde0fe]'>
        <AboutUs
          title='Little Alley Preschool'
          content1='Little Alley is a refresh kindergarten curriculum framework that highlights teaching and learning principles that are relevant for developing competencies of young children'
          content2='We believe that every child is a unique learner with unlimited potential waiting to be unlocked.'
          content3='Kidsroom is designed to provide a nurturing and inspiring environment where children can grow academically and personally.'
          images={images}
          refAbout={refAbout}
          showAbout={showAbout}
        />
      </div>

      <VisionAndMission refVision={refVision} showVision={showVision} />
      <OurClass />
      <WhyLittleAlley items={whyItems} refWhy={refWhy} showWhy={showWhy} />

      <div className='w-full bg-[#bde0fe]'>
        <CurriculumSection
          inViewCurriculum={inViewCurriculum}
          refCurriculum={refCurriculum}
        />
      </div>

      <OurFacilities
        fasilitasImages={fasilitasImages}
        fasilities={facilities}
      />

      <Image
        width={1000}
        height={1000}
        src={Garis}
        className='mt-10 w-full'
        alt='Garis horizontal'
      />

      {/* ✅ Loading skeleton or fallback */}
      {isLoadingGallery ? (
        <p className='py-8 text-center'>Memuat galeri...</p>
      ) : (
        <Gallery gallery={gallery || []} />
      )}

      {isLoadingTestimonials ? (
        <p className='py-8 text-center'>Memuat testimonial...</p>
      ) : (
        <Testimonial
          setSwiperInstance={setSwiperInstance}
          swiperInstance={swiperInstance}
          testimonials={testimonials || []}
        />
      )}

      <Footer />
    </div>
  );
}
