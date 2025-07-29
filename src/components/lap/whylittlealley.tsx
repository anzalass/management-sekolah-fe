'use client';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import Children from '../../../public/children.png';

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
        {/* Card 1 */}
        <Card className='shadow-md'>
          <div className='flex flex-col items-center gap-6 p-6 md:flex-row'>
            <Image
              src={Children}
              alt='Teaching approach'
              width={180}
              height={180}
              className='h-[120px] w-[120px] rounded-xl object-contain md:h-[160px] md:w-[160px]'
            />
            <div className='text-left text-[#0B6CBF]'>
              <h3 className='mb-2 text-xl font-bold'>
                Inclusive Teaching Approach
              </h3>
              <p className='text-sm leading-relaxed md:text-base'>
                We use a variety of teaching methods and become facilitators for
                students with diverse characters — providing equal opportunities
                and strong foundations for lifelong learning.
              </p>
            </div>
          </div>
        </Card>

        {/* Card 2 */}
        <Card className='shadow-md'>
          <div className='flex flex-col items-center gap-6 p-6 md:flex-row'>
            <Image
              src={Children}
              alt='Curriculum-based learning'
              width={180}
              height={180}
              className='h-[120px] w-[120px] rounded-xl object-contain md:h-[160px] md:w-[160px]'
            />
            <div className='text-left text-[#0B6CBF]'>
              <h3 className='mb-2 text-xl font-bold'>Holistic Curriculum</h3>
              <p className='text-sm leading-relaxed md:text-base'>
                Our preschool program blends play-based and thematic learning
                with hands-on activities. We nurture literacy, numeracy, social
                skills, and creativity through an integrated curriculum.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
