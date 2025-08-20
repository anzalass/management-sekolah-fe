'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import imagebg1 from '../../../public/4.jpg';
import founder from '../../../public/founder.jpg';

import imagebg2 from '../../../public/3.jpg';
import imagebg3 from '../../../public/5.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import Footer from '../../components/layout/footer';
import Image from 'next/image';
import Navbar from '../layout/navbar';
import axios from 'axios';
import { API } from '@/lib/server';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface NewsItem {
  image: string;
  title: string;
  content: string;
}

interface GuruTemplate {
  image: string;
  name: string;
  imageUrl?: string;
}

const BASE_URL = `${API}view-image`;

export default function HomeView() {
  const [index, setIndex] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [teachers, setTeachers] = useState<GuruTemplate[]>([]);

  useEffect(() => {
    axios
      .get(`${API}news`)
      .then((response) => {
        setNews(response.data.data);
      })
      .catch((error) => {
        toast.error('Error fetching the news:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API}guru-template`)
      .then((response) => {
        const updatedTeachers = response.data.data.map(
          (teacher: GuruTemplate) => ({
            ...teacher,
            imageUrl: `${BASE_URL}/${teacher.image.split('/').pop()}`
          })
        );
        setTeachers(updatedTeachers);
      })
      .catch((error) => {
        toast.error('Error fetching teacher data:', error);
      });
  }, []);

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? teachers.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === teachers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = teachers[(index - 1 + teachers.length) % teachers.length];
  const currentImage = teachers[index];
  const nextImage = teachers[(index + 1) % teachers.length];
  return (
    <div className=''>
      <Navbar />
      <div className='flex items-center justify-center overflow-auto bg-blue-600 md:h-full'>
        <div className='relative h-full w-full'>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }}
          >
            <SwiperSlide>
              <Image
                src={imagebg1}
                className='h-full w-full object-contain'
                alt='Slide 1'
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={imagebg2}
                className='h-full w-full object-contain'
                alt='Slide 2'
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={imagebg3}
                className='h-full w-full object-contain'
                alt='Slide 3'
              />
            </SwiperSlide>
            <div className='swiper-button-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-2xl text-white' />
            <div className='swiper-button-next absolute right-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-2xl text-white' />
          </Swiper>
        </div>
      </div>

      <section className='bg-white py-12'>
        <div className='container mx-auto px-4 md:px-6'>
          <p className='mx-auto mb-10 max-w-3xl text-justify text-lg font-medium text-muted-foreground md:text-center'>
            <span className='font-semibold'>
              Yayasan Tunas Anak Mulia (YTAM)
            </span>{' '}
            is an educational institution dedicated to nurturing young minds
            through our preschool and tutoring programs. Since our founding in
            2021, we’ve remained committed to providing quality education and
            empowering children to reach their full potential.
          </p>

          <div className='grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16'>
            <Card className='shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl font-bold'>PROBLEM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-justify text-base leading-relaxed text-muted-foreground'>
                  Busy parents and the impact of the COVID-19 pandemic have
                  caused many children to spend more time with gadgets than
                  engaging with their parents. This shift impacts their
                  development in today's digital era.
                </p>
              </CardContent>
            </Card>

            <Card className='shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl font-bold'>SOLUTION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-justify text-base leading-relaxed text-muted-foreground'>
                  We utilize various teaching methods and act as facilitators to
                  support students with different characteristics— giving them
                  equal opportunities to grow. We help build a strong foundation
                  for lifelong learning and academic excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='bg-[#bde0fe] py-12'>
        <div className='container mx-auto px-4 md:px-6'>
          <Card className='mx-auto max-w-6xl shadow-lg'>
            <div className='flex flex-col md:flex-row'>
              {/* Text Content */}
              <div className='order-2 w-full p-6 md:order-1 md:w-[70%] lg:w-3/4'>
                <CardHeader className='hidden md:block'>
                  <CardTitle className='font-tiltwarp text-left text-3xl'>
                    SPEECH FOUNDER
                  </CardTitle>
                  <p className='text-left text-sm font-medium tracking-wide text-muted-foreground'>
                    YAYASAN TUNAS ANAK MULIA
                  </p>
                </CardHeader>

                <CardContent className='font-marathi space-y-4 text-justify text-base leading-relaxed text-muted-foreground'>
                  <p>
                    Dear parents, students, and community members. It is my
                    great pleasure to welcome you to Yayasan Tunas Anak Mulia.
                    Let me share my dedication to early childhood education.
                  </p>
                  <p>
                    Every child is a unique individual with different strengths
                    and challenges. That’s why our educational philosophy is
                    thoughtfully designed to meet the needs of each student.
                  </p>
                  <p>
                    I am delighted that our students continue to thrive across
                    various age groups. Drawing from my experiences, I’ve
                    cultivated an environment that encourages curiosity and
                    critical thinking. We allow students to ask questions freely
                    and discover who they are and how they learn.
                  </p>
                  <p>
                    I encourage all parents to actively observe and support
                    their child’s learning journey. We believe in nurturing
                    talents to bring out their fullest potential.
                  </p>
                  <p>
                    Ultimately, I believe that true learning happens through
                    real experiences—this is the foundation of a child’s growth.
                  </p>
                  <p>
                    Thank you for your trust and continued support in Yayasan
                    Tunas Anak Mulia. Together, we can nurture a bright future.
                  </p>
                </CardContent>
              </div>

              {/* Photo & Info */}
              <div className='order-1 flex w-full flex-col items-center justify-center p-6 md:order-2 md:w-1/3 md:items-start md:pl-4 md:pt-12'>
                {/* Mobile title */}
                <div className='mb-4 block text-center md:hidden'>
                  <h1 className='font-tiltwarp text-2xl'>SPEECH FOUNDER</h1>
                  <p className='text-sm text-muted-foreground'>
                    YAYASAN TUNAS ANAK MULIA
                  </p>
                </div>

                {/* Gambar founder */}
                <div className='mb-4 h-[300px] w-[200px] overflow-hidden rounded-xl bg-gray-200 shadow-md md:ml-6'>
                  <Image
                    src={founder} // Ganti path sesuai file kamu
                    alt='Founder YTAM'
                    width={200}
                    height={300}
                    className='h-full w-full object-cover'
                  />
                </div>

                {/* Nama & Jabatan */}
                <p className='font-tiltwarp text-lg font-semibold md:ml-6'>
                  NOVITA WIJAYA
                </p>
                <p className='text-sm text-muted-foreground md:ml-6'>
                  Founder of Yayasan Tunas Anak Mulia
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className='bg-white py-12'>
        <div className='container mx-auto px-4 md:px-6'>
          {/* Heading Section */}
          <div className='mb-10 text-center'>
            <h2 className='text-3xl font-bold'>Our Class Offerings</h2>
            <p className='mx-auto mt-2 max-w-2xl text-base text-muted-foreground'>
              Yayasan Tunas Anak Mulia offers two types of classes designed to
              optimally support children's development and education.
            </p>
          </div>

          {/* Grid Card Kelas */}
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {/* Card LAP */}
            <Card className='relative h-full shadow-md'>
              <CardHeader>
                <CardTitle className='text-xl'>
                  Little Alley Preschool
                </CardTitle>
              </CardHeader>
              <CardContent className='mb-14 space-y-2 text-justify text-base text-muted-foreground'>
                <p>
                  Little Alley is a refresh kindergarten curriculum framework
                  that highlights teaching and learning principles that are
                  relevant for developing competencies of young children. We
                  believe that every child is a unique learner with unlimited
                  potential waiting to be unlocked. Kidsroom is designed to
                  provide a nurturing and inspiring environment where children
                  can grow academically and personally.
                </p>
              </CardContent>
              <CardFooter className='absolute bottom-1 w-full'>
                <Link href={'/little-alley-preschool'} className='w-full'>
                  <Button className='w-full' variant='outline'>
                    More
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Card LAC */}
            <Card className='relative h-full shadow-md'>
              <CardHeader>
                <CardTitle className='text-xl'>
                  Little Alley Cyberschool
                </CardTitle>
              </CardHeader>
              <CardContent className='mb-14 space-y-2 text-justify text-base text-muted-foreground'>
                <p>
                  Little Alley Cyberschool is an online school built for active,
                  curious, and creative children. We move beyond textbook
                  learning, offering a full day of hands-on activities that let
                  students explore, create, and grow. Here, students lead their
                  own learning journey, while teachers serve as
                  facilitators—guiding, supporting, and helping each child
                  discover their unique strengths. We use technology as a tool
                  to connect learners with real-world experiences and meaningful
                  projects, encouraging independence, critical thinking, and
                  personal growth. Little Alley is a flexible, engaging space
                  where children are free to be themselves and learn in ways
                  that matter to them.
                </p>
              </CardContent>
              <CardFooter className='absolute bottom-1 w-full'>
                <Link href={'/little-alley-cyberschool'} className='w-full'>
                  <Button className='w-full' variant='outline'>
                    More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <div className='mt-10 flex flex-col items-center justify-center px-4'>
        <h1 className='font-tiltwarp mb-6 text-center text-2xl md:text-4xl'>
          MEET OUR TEACHERS
        </h1>
        {teachers.length > 0 && (
          <div className='mb-4 flex flex-wrap items-center justify-center gap-2 transition-all duration-500 md:space-x-4'>
            <Image
              alt={
                teachers[(index - 2 + teachers.length) % teachers.length]
                  ?.name || 'No Name'
              }
              className='hidden h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40 lg:block'
              width={1000}
              height={1000}
              src={
                teachers[(index - 2 + teachers.length) % teachers.length]
                  ?.imageUrl || '/fallback.jpg'
              }
            />
            <Image
              alt={
                teachers[(index - 1 + teachers.length) % teachers.length]
                  ?.name || 'No Name'
              }
              className='h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40'
              width={1000}
              height={1000}
              src={
                teachers[(index - 1 + teachers.length) % teachers.length]
                  ?.imageUrl || '/fallback.jpg'
              }
            />
            <div className='flex flex-col items-center'>
              <Image
                alt={teachers[index]?.name || 'No Name'}
                className='h-32 w-32 rounded-full bg-gray-300 object-cover md:h-60 md:w-60'
                src={teachers[index]?.imageUrl || '/fallback.jpg'}
                width={1000}
                height={1000}
              />
              <p className='mt-2 w-full text-center text-base font-semibold md:text-lg'>
                {teachers[index]?.name || 'No Name'}
              </p>
            </div>
            <Image
              alt={teachers[(index + 1) % teachers.length]?.name || 'No Name'}
              className='h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40'
              src={
                teachers[(index + 1) % teachers.length]?.imageUrl ||
                '/fallback.jpg'
              }
              width={1000}
              height={1000}
            />
            <Image
              alt={teachers[(index + 2) % teachers.length]?.name || 'No Name'}
              className='hidden h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40 lg:block'
              src={
                teachers[(index + 2) % teachers.length]?.imageUrl ||
                '/fallback.jpg'
              }
              width={1000}
              height={1000}
            />
          </div>
        )}
        <div className='mt-4 flex space-x-4'>
          <button
            className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-700 text-gray-700'
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-700 text-gray-700'
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <div className='mt-14 flex items-center justify-center overflow-hidden bg-blue-100 pb-9 pt-10'>
        <div className='w-full max-w-7xl px-2 text-center sm:px-6 md:max-w-full'>
          <h1 className='text-3xl font-bold text-blue-900 sm:text-4xl'>
            NEWS & EVENT
          </h1>
          <div className='relative mt-10 overflow-hidden'>
            <div className='auto-scroll w-max gap-2 px-1 sm:gap-4 sm:px-4'>
              {[...news, ...news].map((item, index) => {
                const imageUrl = `${BASE_URL}/${item.image.split('/').pop()}`;

                return (
                  <div
                    key={index}
                    className='mx-1 flex h-[300px] w-56 flex-shrink-0 flex-col rounded-2xl bg-white px-3 pb-4 pt-2 shadow-lg sm:h-[340px] sm:w-64 md:w-72'
                  >
                    <Image
                      src={imageUrl}
                      alt={`news-${index}`}
                      className='h-[120px] w-full rounded-xl object-cover sm:h-[140px]'
                      width={1000}
                      height={1000}
                    />
                    <h1 className='mb-1 mt-2 text-sm font-bold sm:text-base'>
                      {item.title}
                    </h1>
                    <p className='text-center text-xs italic text-gray-700 sm:text-sm'>
                      {item.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
