'use client';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import lapanak1 from '../../../public/lap-anak1.png';
import lapanak2 from '../../../public/lap-anak2.png';

type Props = {
  refWhy: any;
  showWhy: boolean;
};

export function WhyLittleAlley({ refWhy, showWhy }: Props) {
  return (
    <motion.section
      ref={refWhy}
      initial={{ opacity: 0, y: 60 }}
      animate={showWhy ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='mx-auto max-w-7xl px-4 py-16'
    >
      <h2
        className='mb-12 text-center text-4xl font-extrabold text-[#017BBD]'
        style={{ fontFamily: "'Poetsen One', sans-serif" }}
      >
        WHY <br />
        <span className='text-2xl lg:text-3xl'>LITTLE ALLEY PRESCHOOL?</span>
      </h2>

      <div className='grid grid-cols-1 gap-10 lg:grid-cols-2'>
        {[
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
        ].map((item, i) => (
          <Card
            key={i}
            className='shadow-md transition-transform duration-300 hover:scale-[1.02]'
          >
            <div className='flex flex-col items-center gap-6 p-6 md:flex-row'>
              <div className='relative h-[120px] w-[120px] flex-shrink-0 md:h-[160px] md:w-[160px]'>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className='rounded-xl object-contain'
                  priority // ✅ Prioritize loading (faster render)
                  sizes='(max-width: 768px) 120px, 160px'
                />
              </div>
              <div className='text-left text-[#0B6CBF]'>
                <h3 className='mb-2 text-xl font-bold'>{item.title}</h3>
                <p className='text-sm leading-relaxed md:text-base'>
                  {item.desc}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.section>
  );
}
