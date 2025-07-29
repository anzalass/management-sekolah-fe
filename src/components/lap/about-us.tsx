'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import child1 from '../../../public/childs1.jpg';
import child2 from '../../../public/childs2.jpg';
import child3 from '../../../public/childs3.jpg';
import Image from 'next/image';

export function AboutUs({
  refAbout,
  showAbout,
  content
}: {
  refAbout: any;
  showAbout: boolean;
  content: string;
}) {
  const images = [child1, child2, child3];
  return (
    <motion.section
      ref={refAbout}
      initial={{ opacity: 0, x: -100 }}
      animate={showAbout ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className='relative mx-auto px-4 py-20 lg:max-w-7xl'
      id='about'
    >
      <div className='flex flex-col-reverse items-center justify-between gap-10 md:flex-row md:gap-20'>
        {/* Swiper Card Section */}
        <div className='mx-auto w-11/12 md:w-[40%]'>
          <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards]}
            className='mx-auto h-[320px] w-11/12'
          >
            {images.map((label, index) => (
              <SwiperSlide
                key={index}
                className='flex items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-800 shadow-xl'
              >
                <Image alt='foto' width={1000} height={1000} src={label} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Text Section */}
        <div className='w-full space-y-6 text-left md:w-[60%]'>
          <div className='h-1 w-28 rounded-full bg-blue-700'></div>
          <h2
            className='text-4xl font-extrabold text-[#017BBD] sm:text-3xl'
            style={{ fontFamily: "'Poetsen One', sans-serif" }}
          >
            Introducing Little Alley
          </h2>
          <p className='text-base leading-relaxed text-[#0066b3] md:text-xl'>
            {content}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
