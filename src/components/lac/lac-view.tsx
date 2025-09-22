'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { easeInOut } from 'framer-motion';
import lacanak1 from '../../../public/lac-anak1.png';
import lacanak2 from '../../../public/lac-anak2.png';

import fasilitaslac1 from '../../../public/fasilitaslac7.jpg';
import fasilitaslac2 from '../../../public/fasilitaslac8.jpg';
import fasilitaslac3 from '../../../public/fasilitaslac9.jpg';
import fasilitaslac4 from '../../../public/fasilitaslac10.jpg';
import fasilitaslac5 from '../../../public/fasilitaslac11.jpg';
import fasilitaslac6 from '../../../public/fasilitaslac12.jpg';
import fasilitaslac7 from '../../../public/fasilitaslac14.jpg';
import Galery1 from '../../../public/galery1.jpg';
import Galery2 from '../../../public/galery2.jpg';
import Galery3 from '../../../public/galery3.jpg';
import Galery4 from '../../../public/galery4.jpg';
import Galery5 from '../../../public/galery5.jpg';
import Galery6 from '../../../public/galery6.jpg';
import Galery7 from '../../../public/galery7.jpg';
import primary1 from '../../../public/primary1.jpg';
import primary2 from '../../../public/primary2.jpg';
import primary3 from '../../../public/primary3.jpg';
import primary4 from '../../../public/primary4.jpg';
import primary5 from '../../../public/primary5.jpg';
import primary6 from '../../../public/primary6.jpg';
import Garis from '../../../public/Garis.png';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Footer from '../../components/layout/footer';
import Image from 'next/image';
import Navbar from '../../components/layout/navbar';
import { AboutUs } from '../lap/about-us';
import { VisionAndMission } from '../lap/visimisi';
import { CurriculumSection } from '../lap/curriculum';
import { toast } from 'sonner';
import Jumbotron from '../lap/jumbotron';
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
        ease: easeInOut
      }
    }
  };
};

const testimonials = [
  {
    img: fasilitaslac1,
    text: '“blablablala...”'
  },
  {
    img: fasilitaslac2,
    text: '“blablablala...”'
  },
  {
    img: fasilitaslac3,
    text: '“blablablala...”'
  },
  {
    img: fasilitaslac4,
    text: '“blablablala...”'
  },
  {
    img: fasilitaslac6,
    text: '“Tambahan agar loop & next jalan.”'
  },
  {
    img: fasilitaslac7,
    text: '“Tambahan agar loop & next jalan.”'
  }
];

const galleryImages = [
  Galery1,
  Galery2,
  Galery3,
  Galery4,
  Galery5,
  Galery6,
  Galery7
];

export default function LacView() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
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

  const [refWhy, inViewWhy] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const [showWhy, setShowWhy] = useState(false);
  const [refCurriculum, inViewCurriculum] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    api
      .get(`testimonials`)
      .then((response: any) => {
        setTestimonials(response.data.data);
      })
      .catch((error: any) => {
        toast.error('Error fetching the news:', error);
      });
  }, []);

  useEffect(() => {
    api
      .get(`gallery`)
      .then((response: any) => {
        setGallery(response.data.data);
      })
      .catch((error: any) => {
        toast.error('Error fetching the news:', error);
      });
  }, []);

  useEffect(() => {
    if (inViewAbout) setShowAbout(true);
    if (inViewVision) setShowVision(true);
    if (inViewWhy) setShowWhy(true);
  }, [inViewAbout, inViewVision, inViewWhy]);
  return (
    <div className='lac md:overflow-x-hidden'>
      <Navbar />
      <Jumbotron />

      <div className='w-full bg-[#bde0fe]'>
        <AboutUs
          refAbout={refAbout}
          showAbout={showAbout}
          content={
            'Little Alley Cyberschool is an online school built for active, curious, and creative children. We move beyond textbook learning, offering a full day of hands-on activities that let students explore, create, and grow. Here, students lead their own learning journey, while teachers serve as facilitators—guiding, supporting, and helping each child discover their unique strengths. We use technology as a tool to connect learners with real-world experiences and meaningful projects, encouraging independence, critical thinking, and personal growth. Little Alley is a flexible, engaging space where children are free to be themselves and learn in ways that matter to them.'
          }
        />
      </div>
      <VisionAndMission refVision={refVision} showVision={showVision} />

      <div className='w-full bg-[#bde0fe]'>
        <CurriculumSection
          inViewCurriculum={inViewCurriculum}
          refCurriculum={refCurriculum}
        />
      </div>

      {/* Konten OUR CLASS */}
      <div className='relative overflow-hidden py-16'>
        {/* Awan Atas */}
        {/* <Image
          src={Awan2}
          alt='Awan Atas'
          width={1920}
          height={1080}
          className='absolute left-0 top-0 z-10 w-full object-cover'
        /> */}

        {/* Konten */}
        <div className='relative z-10 mx-auto max-w-3xl'>
          {/* OUR CLASS Title */}
          <div className='mb-16 flex justify-center'>
            <div
              className='rounded-[30px] bg-white p-4 text-center text-4xl font-extrabold text-[#017BBD] shadow-md'
              style={{ fontFamily: "'Poetsen One', sans-serif" }}
            >
              OUR CLASS
            </div>
          </div>

          {/* Grid Cards */}
          <div className='grid grid-cols-2 gap-y-12 md:gap-10 lg:grid-cols-2'>
            {[
              {
                image: primary1,
                title: 'Primary 1'
              },
              {
                image: primary2,
                title: 'Primary 2'
              },
              {
                image: primary3,
                title: 'Primary 3'
              },
              {
                image: primary4,
                title: 'Primary 4'
              },
              {
                image: primary5,
                title: 'Primary 5'
              },
              {
                image: primary6,
                title: 'Primary 6'
              }
            ].map((item, index) => (
              <div
                key={index}
                className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-105'
              >
                <div className='card mx-auto mb-4 flex w-[85%] max-w-md items-center justify-center overflow-hidden rounded-2xl border-[6px] border-blue-500 bg-white'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    className='h-full w-full object-cover'
                  />
                </div>
                <p className='text-2xl font-bold text-blue-900'>{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awan Bawah */}
        {/* <Image
          src={Awan}
          alt='Awan Bawah'
          width={1920}
          height={1080}
          className='absolute bottom-0 left-0 z-0 w-full rotate-180 object-cover'
        /> */}
      </div>

      <motion.div
        ref={refWhy}
        initial={{ opacity: 0, y: 60 }}
        animate={showWhy ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='mx-auto mt-5 max-w-7xl px-2 py-12'
      >
        <h2
          className='title-font text-center text-4xl font-extrabold leading-tight text-[#017BBD]'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          WHY
          <br />
          <span className='mt-1 block text-xl lg:text-3xl'>
            LITTLE ALLEY CYBERSCHOOL ?
          </span>
        </h2>

        <div className='mt-10 flex flex-col items-center space-y-10 md:flex-row md:items-center md:justify-center md:space-x-10 lg:space-x-20'>
          <div className='flex max-w-[180px] flex-col items-center justify-center'>
            <Image
              width={1000}
              height={1000}
              src={lacanak2}
              alt='Young girl with two buns hairstyle holding a phone'
              className='h-[180px] w-[180px] object-contain'
            />
          </div>

          <div className='max-w-xl text-center text-sm leading-relaxed text-[#0B6CBF] sm:text-base md:text-left'>
            Little Alley Cyberschool As a fully internet-based school, all
            classes, exams, and announcements are conducted through email and
            our official website. This makes it easy for both students and
            parents to stay informed and involved—anytime, anywhere.
          </div>
        </div>

        <div className='mt-10 flex flex-col items-center space-y-10 md:flex-row md:items-center md:justify-center md:space-x-10 lg:space-x-20'>
          <div className='max-w-xl text-center text-sm leading-relaxed text-[#0B6CBF] sm:text-base md:text-right'>
            Little Alley Cyberschool offers a modern and flexible learning
            experience designed for today’s students. We use the IB-based
            curriculum from Swiss, carefully tailored to help each child grow
            through their unique interests and talents. Our approach encourages
            curiosity, independence, and lifelong learning.
          </div>

          <div className='flex max-w-[180px] flex-col items-center justify-center'>
            <Image
              width={1000}
              height={1000}
              src={lacanak1}
              alt='Young girl with two buns hairstyle holding a phone'
              className='h-[180px] w-[180px] object-contain'
            />
          </div>
        </div>
      </motion.div>

      {/* Curriculum */}

      <div className='mx-auto mt-24 max-w-3xl px-4 py-8 lg:mt-0'>
        <h2
          className='mb-6 text-center text-4xl font-extrabold text-[#017BBD]'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          OUR FACILITIES
        </h2>

        <div className='mt-14 grid grid-cols-1 justify-items-center gap-x-4 gap-y-6 md:grid-cols-2'>
          <Image
            width={1000}
            height={1000}
            src={fasilitaslac1}
            alt='Facility 1'
            className='w-full transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={fasilitaslac2}
            alt='Facility 2'
            className='w-full transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={fasilitaslac3}
            alt='Facility 3'
            className='w-full transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={fasilitaslac4}
            alt='Facility 4'
            className='w-full transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={fasilitaslac5}
            alt='Facility 1'
            className='w-full transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={fasilitaslac6}
            alt='Facility 1'
            className='w-full transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />
          <Image
            width={1000}
            height={1000}
            src={fasilitaslac7}
            alt='Facility 2'
            className='w-full transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
          />

          <div className='mx-auto mb-6 mt-9 block w-72 text-sm leading-tight text-[#0066b3]'>
            <p>
              Yayasan Tunas Anak Mulia is equipped with facilities and resources
              to enhance the learning experience:
            </p>
            <ul className='mt-2 list-inside list-disc space-y-1'>
              <li>Spacious and Safe Learning</li>
              <li>Environment Well-Equipped</li>
              <li>Classrooms Library and Resource</li>
              <li>Center Playgrounds</li>
            </ul>
          </div>
        </div>
      </div>

      <Image
        src={Garis}
        className='mt-10 mt-24 w-full'
        alt='Garis horizontal'
      />

      <Footer />
    </div>
  );
}
