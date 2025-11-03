'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import Image from 'next/image';
import { Check } from 'lucide-react';

export function AboutUs({
  refAbout,
  showAbout,
  title,
  images,
  content1,
  content2,
  content3
}: {
  refAbout: any;
  showAbout: boolean;
  title: string;
  images: any[];
  content1: string;
  content2: string;
  content3: string;
}) {
  return (
    <motion.section
      ref={refAbout}
      initial={{ opacity: 0, x: -100 }}
      animate={showAbout ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className='relative mx-auto bg-[#bde0fe] px-4 py-20 lg:max-w-7xl'
      id='about'
    >
      <section className='py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            {/* Image Carousel */}
            <div className='relative flex justify-center'>
              <div className='ml-0 w-[90%] md:mx-auto md:w-[100%]'>
                <Swiper
                  effect='cards'
                  grabCursor={true}
                  modules={[EffectCards]}
                  className='mx-auto w-full max-w-sm'
                  allowTouchMove={true}
                  slidesPerView={1}
                  centeredSlides={true}
                  autoplay={false} // pastikan autoplay mati
                >
                  {images.map((label, index) => (
                    <SwiperSlide
                      key={index}
                      className='flex items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-800 shadow-xl'
                    >
                      <Image
                        alt='foto'
                        width={400}
                        height={400}
                        className='h-auto w-full rounded-2xl object-cover'
                        src={label}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <div className='mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600'></div>
              <h2 className='mb-6 text-4xl font-bold text-blue-900 md:text-5xl'>
                {title}
              </h2>
              <p className='mb-6 text-lg leading-relaxed text-blue-800'>
                {content1}
              </p>
              <p className='mb-8 text-lg leading-relaxed text-blue-800'>
                {content2}
              </p>
              <div className='flex items-center gap-4'>
                {/* <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-600'>
                  <Check className='h-6 w-6 text-white' />
                </div> */}
                <p className='font-semibold text-blue-900'>{content3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.section>
  );
}
