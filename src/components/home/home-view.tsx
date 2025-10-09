'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import imagebg1 from '../../../public/4.jpg';
import imagebg2 from '../../../public/3.jpg';
import imagebg3 from '../../../public/5.jpg';
import founder from '../../../public/founder.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Footer from '../../components/layout/footer';
import Navbar from '../layout/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles
} from 'lucide-react';

import banner1 from '../../../public/background.png';
import banner2 from '../../../public/event1.jpg';
import banner3 from '../../../public/event2.jpg';

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

export default function HomeView() {
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTeacher, setCurrentTeacher] = useState(2);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const {
    data: news = [],
    isLoading: loadingNews,
    isError: errorNews
  } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await api.get('news');
      return res.data.data as NewsItem[];
    },
    staleTime: 1000 * 60 * 5
  });

  const {
    data: teachers = [],
    isLoading: loadingTeachers,
    isError: errorTeachers
  } = useQuery({
    queryKey: ['guru-template'],
    queryFn: async () => {
      const res = await api.get('guru-template');
      return res.data.data.map((t: GuruTemplate) => ({
        ...t,
        imageUrl: t.image
      })) as GuruTemplate[];
    },
    staleTime: 1000 * 60 * 5
  });

  if (errorNews) toast.error('Gagal memuat berita');
  if (errorTeachers) toast.error('Gagal memuat data guru');

  const slides = useMemo(() => [banner1, banner2, banner3], []);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextTeacher = () => {
    setCurrentTeacher((prev) => (prev + 1) % teachers.length);
  };

  const prevTeacher = () => {
    setCurrentTeacher((prev) => (prev - 1 + teachers.length) % teachers.length);
  };

  const getTeacherIndex = (offset: any) => {
    return (currentTeacher + offset + teachers.length) % teachers.length;
  };

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      {/* Hero Slider */}
      <div className='relative h-[60vh] overflow-hidden md:h-[80vh]'>
        <div className='absolute inset-0'>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide}
                alt={`Slide ${idx + 1}`}
                className='h-full w-full object-cover'
                placeholder='blur'
                priority={idx === 0}
                sizes='100vw'
                height={2000}
                width={2000}
              />
              <div className='absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60'></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className='relative z-10 flex h-full items-center justify-center px-4 text-center'>
          <div className='max-w-6xl animate-[fadeInUp_1s_ease-out]'>
            <div className='mb-6 inline-block rounded-full bg-white/20 px-6 py-2 backdrop-blur-sm'>
              <span className='font-semibold text-white'>✨ Since 2021</span>
            </div>
            <h1 className='mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl'>
              Yayasan Tunas
              <br />
              Anak Mulia
            </h1>
            <p className='mx-auto mb-8 max-w-2xl text-xl text-blue-100 md:text-2xl'>
              Nurturing young minds through quality education and empowering
              children to reach their full potential
            </p>
            <button
              onClick={() =>
                document.getElementById('about-section')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }
              className='transform rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl'
            >
              More
            </button>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + slides.length) % slides.length
            )
          }
          className='absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30'
        >
          <ChevronLeft className='h-6 w-6 text-white' />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className='absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30'
        >
          <ChevronRight className='h-6 w-6 text-white' />
        </button>

        {/* Dots */}
        <div className='absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2'>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'h-2 w-8 bg-white'
                  : 'h-2 w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <section
        id='about-section'
        className='bg-gradient-to-b from-white to-gray-50 py-20'
      >
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900 md:text-5xl'>
              About{' '}
              <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                YTAM
              </span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl leading-relaxed text-gray-600'>
              An educational institution dedicated to nurturing young minds
              through our preschool and tutoring programs since 2021
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            {/* Problem Card */}
            <div className='group rounded-3xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'>
              <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 transition-transform duration-500 group-hover:scale-110'>
                <Award className='h-8 w-8 text-white' />
              </div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>
                The Challenge
              </h3>
              <p className='leading-relaxed text-gray-600'>
                Busy parents and the COVID-19 pandemic have caused many children
                to spend more time with gadgets than engaging with their
                parents. This shift significantly impacts their development in
                today's digital era.
              </p>
            </div>

            {/* Solution Card */}
            <div className='group rounded-3xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'>
              <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 transition-transform duration-500 group-hover:scale-110'>
                <Sparkles className='h-8 w-8 text-white' />
              </div>
              <h3 className='mb-4 text-2xl font-bold text-gray-900'>
                Our Solution
              </h3>
              <p className='leading-relaxed text-gray-600'>
                We utilize various teaching methods and act as facilitators to
                support students with different characteristics—giving them
                equal opportunities to grow and build a strong foundation for
                lifelong learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className='bg-gradient-to-br from-blue-50 to-indigo-50 py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='overflow-hidden rounded-3xl bg-white shadow-2xl'>
            <div className='grid gap-8 md:grid-cols-3'>
              {/* Founder Image */}
              <div className='flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 p-12 text-center md:col-span-1'>
                <div className='mb-6 h-48 w-48 overflow-hidden rounded-2xl border-4 border-white shadow-2xl'>
                  <Image
                    src={founder}
                    alt='Founder YTAM'
                    width={200}
                    height={300}
                    placeholder='blur'
                    sizes='200px'
                    className='h-full w-full object-cover'
                  />
                </div>
                <h3 className='mb-2 text-2xl font-bold text-white'>
                  NOVITA WIJAYA
                </h3>
                <p className='text-blue-100'>Founder of YTAM</p>
                <div className='mt-6 flex gap-2'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className='h-2 w-2 rounded-full bg-white/50'
                    ></div>
                  ))}
                </div>
              </div>

              {/* Founder Speech */}
              <div className='p-8 md:col-span-2 md:p-12'>
                <div className='mb-6 flex items-center gap-3'>
                  <Quote className='h-8 w-8 text-blue-600' />
                  <h2 className='text-3xl font-bold text-gray-900'>
                    Founder's Message
                  </h2>
                </div>
                <div className='space-y-4 leading-relaxed text-gray-600'>
                  <p>
                    Dear parents, students, and community members. It is my
                    great pleasure to welcome you to Yayasan Tunas Anak Mulia.
                    Let me share my dedication to early childhood education.
                  </p>
                  <p>
                    Every child is a unique individual with different strengths
                    and challenges. That's why our educational philosophy is
                    thoughtfully designed to meet the needs of each student.
                  </p>
                  <p>
                    I am delighted that our students continue to thrive across
                    various age groups. Drawing from my experiences, I've
                    cultivated an environment that encourages curiosity and
                    critical thinking.
                  </p>
                  <p>
                    I encourage all parents to actively observe and support
                    their child's learning journey. We believe in nurturing
                    talents to bring out their fullest potential.
                  </p>
                  <p className='font-semibold text-gray-900'>
                    Thank you for your trust and continued support. Together, we
                    can nurture a bright future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900 md:text-5xl'>
              Meet Our{' '}
              <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                Educators
              </span>
            </h2>
            <p className='text-xl text-gray-600'>
              Experienced and passionate teachers dedicated to your child's
              success
            </p>
          </div>

          <div className='mb-8 flex items-center justify-center gap-4'>
            {[-2, -1, 0, 1, 2].map((offset) => {
              const teacher = teachers[getTeacherIndex(offset)];
              const isCenter = offset === 0;

              return (
                <div
                  key={offset}
                  className={`transition-all duration-500 ${
                    isCenter ? 'scale-100' : 'scale-75 opacity-40'
                  }`}
                >
                  <div
                    className={`relative ${isCenter ? 'h-48 w-48' : 'h-32 w-32'}`}
                  >
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-20 blur-xl ${isCenter ? 'scale-110' : ''}`}
                    ></div>
                    <img
                      src={teacher?.imageUrl}
                      alt={teacher?.name}
                      className='relative h-full w-full rounded-full border-4 border-white object-cover shadow-2xl'
                    />
                  </div>
                  {isCenter && (
                    <div className='mt-4 text-center'>
                      <p className='text-lg font-bold text-gray-900'>
                        {teacher?.name}
                      </p>
                      {/* <p className='text-gray-600'>{teacher.subject}</p> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className='flex justify-center gap-4'>
            <button
              onClick={prevTeacher}
              className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 transition-all hover:scale-110 hover:border-blue-600 hover:text-blue-600'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
            <button
              onClick={nextTeacher}
              className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 transition-all hover:scale-110 hover:border-blue-600 hover:text-blue-600'
            >
              <ChevronRight className='h-6 w-6' />
            </button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className='overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-white md:text-5xl'>
              News & Events
            </h2>
            <p className='text-xl text-blue-100'>
              Stay updated with our latest activities and achievements
            </p>
          </div>

          <div className='relative'>
            <div className='hide-scrollbar flex gap-6 overflow-x-auto pb-4'>
              {news.map((item, idx) => (
                <div
                  key={idx}
                  className='w-80 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'
                >
                  <div className='relative h-48'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='h-full w-full object-cover'
                    />
                    {/* <div className='absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white px-3 py-1'>
                      <Calendar className='h-4 w-4 text-blue-600' />
                      <span className='text-sm font-semibold text-gray-900'>
                        {item.date}
                      </span>
                    </div> */}
                  </div>
                  <div className='p-6'>
                    <h3 className='mb-2 text-xl font-bold text-gray-900'>
                      {item.title}
                    </h3>
                    <p className='text-gray-600'>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Footer />
    </div>
  );
}
