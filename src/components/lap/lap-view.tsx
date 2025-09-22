'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/layout/navbar';
import Garis from '../../../public/Garis.png';

import Footer from '../../components/layout/footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import axios from 'axios';
import { API } from '@/lib/server';
import Jumbotron from './jumbotron';
import { AboutUs } from './about-us';
import { VisionAndMission } from './visimisi';
import OurClass from './ourclass';
import { WhyLittleAlley } from './whylittlealley';
import { CurriculumSection } from './curriculum';
import OurFacilities from './ourfacilities';
import Gallery from './gallery';
import Testimonial from './testimonial';
import { toast } from 'sonner';
import api from '@/lib/api';

const fadeIn = (direction = 'up', delay = 0) => {
  return {
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
  };
};

interface GalleryItem {
  image: string;
}

interface TestimonialItem {
  parentName: string;
  image: string;
  description: string;
}

const BASE_URL = `view-image`;

export default function Lap() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [refAbout, inViewAbout] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [refVision, inViewVision] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [showAbout, setShowAbout] = useState(false);
  const [showVision, setShowVision] = useState(false);

  const [refWhy, inViewWhy] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [showWhy, setShowWhy] = useState(false);
  const [refCurriculum, inViewCurriculum] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inViewAbout) setShowAbout(true);
    if (inViewVision) setShowVision(true);
    if (inViewWhy) setShowWhy(true);
  }, [inViewAbout, inViewVision, inViewWhy]);

  useEffect(() => {
    api
      .get(`testimonials`)
      .then((response) => {
        setTestimonials(response.data.data);
      })
      .catch((error) => {
        toast.error('Error fetching the news:', error);
      });
  }, []);

  useEffect(() => {
    api
      .get(`gallery`)
      .then((response) => {
        setGallery(response.data.data);
      })
      .catch((error) => {
        toast.error('Error fetching the news:', error);
      });
  }, []);

  return (
    <div className='lap md:overflow-x-hidden'>
      <Navbar />
      <Jumbotron />
      <div className='w-full bg-[#bde0fe]'>
        <AboutUs
          content='Little Alley is a refresh kindergarten curriculum framework that highlights teaching and learning principles that are relevant for developing competencies of young children. We believe that every child is a unique learner with unlimited potential waiting to be unlocked. Kidsroom is designed to provide a nurturing and inspiring environment where children can grow academically and personally.'
          refAbout={refAbout}
          showAbout={showAbout}
        />
      </div>
      <VisionAndMission refVision={refVision} showVision={showVision} />

      <OurClass />
      <WhyLittleAlley refWhy={refWhy} showWhy={showWhy} />

      <div className='w-full bg-[#bde0fe]'>
        <CurriculumSection
          inViewCurriculum={inViewCurriculum}
          refCurriculum={refCurriculum}
        />
      </div>

      <OurFacilities />

      <Image
        width={1000}
        height={1000}
        src={Garis}
        className='mt-10 w-full'
        alt='Garis horizontal'
      />
      <Gallery gallery={gallery} />
      <Testimonial
        setSwiperInstance={setSwiperInstance}
        swiperInstance={swiperInstance}
        testimonials={testimonials}
      />

      <Footer />
    </div>
  );
}
