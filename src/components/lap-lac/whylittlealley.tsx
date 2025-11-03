'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

type WhyItem = {
  src: StaticImageData | string; // Bisa gambar import statis atau URL string
  alt: string;
  title: string;
  desc: string;
};

type Props = {
  refWhy: React.Ref<HTMLDivElement>;
  showWhy: boolean;
  items: WhyItem[];
};

export function WhyLittleAlley({ refWhy, showWhy, items }: Props) {
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
        {items.map((item, i) => (
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
                  priority
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
