'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import image1 from '../../../public/asuma.jpg';
import image2 from '../../../public/choji.jpg';
import image3 from '../../../public/guy.jpg';
import image4 from '../../../public/hinata.jpg';
import image5 from '../../../public/itachi.jpg';
import image6 from '../../../public/jiraya.jpg';
import image7 from '../../../public/kakashi.jpg';
import image8 from '../../../public/rocklee.jpg';
import image9 from '../../../public/naruto.jpg';
import image10 from '../../../public/shikamaru.jpg';
import imagebg1 from '../../../public/4.jpg';
import imagebg2 from '../../../public/3.jpg';
import imagebg3 from '../../../public/5.jpg';
import imageevn1 from '../../../public/event1.jpg';
import imageevn2 from '../../../public/event2.jpg';
import imageevn3 from '../../../public/event3.jpg';
import imageevn4 from '../../../public/event4.jpg';
import imageevn5 from '../../../public/event5.jpg';
import imageevn6 from '../../../public/event6.jpg';
import imageevn7 from '../../../public/event7.jpg';
import imageevn8 from '../../../public/event8.jpg';
import imageevn9 from '../../../public/event9.jpg';
import imageevn10 from '../../../public/event10.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import Footer from '../../components/layout/footer';
import Image from 'next/image';
import Navbar from '../layout/navbar';
import axios from 'axios';
import { API } from '@/lib/server';

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
        console.error('Error fetching the news:', error);
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
        console.error('Error fetching teacher data:', error);
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

      <div className='py-8'>
        <div className='container mx-auto px-6'>
          <p className='font-marathi text-black-700 mx-auto mb-8 w-full px-4 text-justify text-lg md:w-[70%] md:text-center'>
            Yayasan Tunas Anak Mulia (YTAM), an educational institution
            dedicated to nurturing young minds through our preschool and
            tutoring services. Since our establishment in 2021, we have been
            committed to providing quality education and empowering them to
            reach their full potential.
          </p>
          <div className='flex flex-col items-center justify-center text-center md:flex-row md:justify-between md:text-left'>
            <div className='mb-8 md:mb-0 md:w-1/2'>
              <h2 className='mb-4 text-2xl font-bold'>PROBLEM</h2>
              <p className='font-marathi text-black-700 mx-auto w-[90%] text-justify text-lg md:mx-0 md:text-left'>
                Busy parents and the impact of the COVID-19 pandemic have led to
                many children interacting more with gadgets than with their
                parents in the development in this modern era.
              </p>
            </div>
            <div className='md:w-1/2 md:text-right'>
              <h2 className='mb-4 text-2xl font-bold'>SOLUTION</h2>
              <p className='font-marathi text-black-700 mx-auto w-[90%] text-justify text-lg md:mx-0 md:ml-[50px] md:text-right lg:ml-16'>
                We teach using various methods, become facilitators for students
                with diverse characters because they have the same
                opportunities. We provide our students with a strong foundation
                for lifelong learning and leading academically.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-[90%] rounded bg-gray-200 p-8 shadow-lg'>
        <div className='flex flex-col items-center md:flex-row'>
          <div className='order-2 p-4 md:order-1 md:w-[70%] lg:w-3/4'>
            <h1 className='font-tiltwarp mb-2 hidden text-left text-3xl md:block'>
              SPEECH FOUNDER
            </h1>
            <h2 className='font-tiltwarp mb-4 hidden text-left text-lg md:block'>
              YAYASAN TUNAS ANAK MULIA
            </h2>

            <p className='font-marathi word-wrap break-word mb-4 text-justify'>
              Dear parents, students, and community members. It is my great
              pleasure to welcome you to the Yayasan Tunas Anak Mulia. Let me
              tell about my dedication in early childhood programme.
            </p>
            <p className='font-marathi mb-4 text-justify'>
              Because every child is a unique individual with different
              strengths and weakness, that's why our philosophy of education has
              been designed to our students.
            </p>
            <p className='font-marathi mb-4 text-justify'>
              I am delighted that our students continue to be very happy in a
              range of their ages. Reflecting on my experiences, I created the
              critical environment to our students school. We let them to ask as
              many as they want, we also understanding the concept of who
              children are, what they are capable or how they learn from the
              curiosity.
            </p>
            <p className='font-marathi mb-4 text-justify'>
              Thus, in this great time I engaged all parents to see and observe
              how your child learn and growth differently with nurture their
              talents to bring out their almost potential.
            </p>
            <p className='font-marathi mb-4 text-justify'>
              Finally, I believed that learning occurs when children are
              involved in first hand experiences is the point of child's growth.
            </p>
            <p className='font-marathi mb-4 text-justify'>
              Thank you for your trust and support to Yayasan Tunas Anak Mulia.
              I hope together we can nurture bright future.
            </p>
          </div>

          <div className='order-1 mt-8 flex flex-col items-center md:order-2 md:mt-0 md:w-1/4'>
            <h1 className='font-tiltwarp mb-1 block text-center text-2xl md:hidden'>
              SPEECH FOUNDER
            </h1>
            <h2 className='font-tiltwarp mb-3 block text-center text-sm md:hidden'>
              YAYASAN TUNAS ANAK MULIA
            </h2>

            <div className='image1 mb-4 h-[350px] w-[220px] rounded-[1rem] bg-red-700 md:ml-10 md:mt-[1rem] lg:ml-0 lg:mt-0 lg:h-[350px]'></div>
            <p className='font-tiltwarp md:ml-5 lg:ml-0'>NOVITA WIJAYA</p>
            <p className='font-marathi text-sm md:ml-10 md:w-[120%] lg:ml-0 lg:w-auto'>
              Founder Yayasan Tunas Anak Mulia
            </p>
          </div>
        </div>
      </div>

      <div className='mt-10 flex flex-col items-center justify-center px-4'>
        <h1 className='font-tiltwarp mb-6 text-center text-2xl md:text-4xl'>
          MEET OUR TEACHERS
        </h1>
        {teachers.length > 0 && (
          <div className='mb-4 flex flex-wrap items-center justify-center gap-2 transition-all duration-500 md:space-x-4'>
            <img
              alt={
                teachers[(index - 2 + teachers.length) % teachers.length]
                  ?.name || 'No Name'
              }
              className='hidden h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40 lg:block'
              src={
                teachers[(index - 2 + teachers.length) % teachers.length]
                  ?.imageUrl || '/fallback.jpg'
              }
            />
            <img
              alt={
                teachers[(index - 1 + teachers.length) % teachers.length]
                  ?.name || 'No Name'
              }
              className='h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40'
              src={
                teachers[(index - 1 + teachers.length) % teachers.length]
                  ?.imageUrl || '/fallback.jpg'
              }
            />
            <div className='flex flex-col items-center'>
              <img
                alt={teachers[index]?.name || 'No Name'}
                className='h-32 w-32 rounded-full bg-gray-300 object-cover md:h-60 md:w-60'
                src={teachers[index]?.imageUrl || '/fallback.jpg'}
              />
              <p className='mt-2 w-full text-center text-base font-semibold md:text-lg'>
                {teachers[index]?.name || 'No Name'}
              </p>
            </div>
            <img
              alt={teachers[(index + 1) % teachers.length]?.name || 'No Name'}
              className='h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40'
              src={
                teachers[(index + 1) % teachers.length]?.imageUrl ||
                '/fallback.jpg'
              }
            />
            <img
              alt={teachers[(index + 2) % teachers.length]?.name || 'No Name'}
              className='hidden h-20 w-20 rounded-full bg-gray-300 object-cover opacity-70 md:h-40 md:w-40 lg:block'
              src={
                teachers[(index + 2) % teachers.length]?.imageUrl ||
                '/fallback.jpg'
              }
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
