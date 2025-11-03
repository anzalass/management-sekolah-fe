'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import Image from 'next/image';
import React from 'react';

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
      className='relative mx-auto bg-[#bde0fe] px-4 py-16 lg:py-24'
      id='about'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Swiper Image Carousel */}
          <div className='flex justify-center'>
            <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
              <Swiper
                effect='cards'
                grabCursor={true}
                modules={[EffectCards]}
                className='mx-auto w-[60%] sm:w-[80%] md:w-full'
                slidesPerView={1}
                centeredSlides={true}
              >
                {images.map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className='flex items-center justify-center rounded-2xl bg-blue-100 shadow-xl'
                  >
                    <Image
                      alt={`foto-${index}`}
                      width={400}
                      height={400}
                      className='h-auto w-full rounded-2xl object-cover'
                      src={img}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Text Content */}
          <div className='flex flex-col text-center lg:text-left'>
            <h2 className='mb-6 text-3xl font-bold text-blue-900 md:text-5xl'>
              {title}
            </h2>
            <p className='mb-6 text-base leading-relaxed text-blue-800 md:text-lg'>
              {content1}
            </p>
            <p className='mb-8 text-base leading-relaxed text-blue-800 md:text-lg'>
              {content2}
            </p>
            <p className='font-semibold text-blue-900'>{content3}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
