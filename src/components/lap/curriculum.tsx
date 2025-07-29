'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Education from '../../../public/education.png';

type Props = {
  refCurriculum: any;
  inViewCurriculum: boolean;
};

export function CurriculumSection({ refCurriculum, inViewCurriculum }: Props) {
  return (
    <motion.section
      ref={refCurriculum}
      initial='hidden'
      animate={inViewCurriculum ? 'show' : 'hidden'}
      className='mx-auto mt-24 max-w-7xl px-4 py-16'
    >
      <h2
        className='mb-12 text-center text-4xl font-extrabold text-[#017BBD]'
        style={{ fontFamily: "'Poetsen One', sans-serif" }}
      >
        OUR CURRICULUM
      </h2>

      <div className='grid grid-cols-1 gap-8 p-6 md:items-center lg:grid-cols-2'>
        {/* Gambar */}
        <div className='flex justify-center'>
          <Image
            src={Education}
            alt='Curriculum illustration'
            width={1000}
            height={1000}
            className='h-full w-full rounded-lg object-cover'
          />
        </div>

        {/* Konten */}
        <div className='space-y-5'>
          <CardHeader className='p-0'>
            <CardTitle className='text-xl font-semibold text-[#0066b3] md:text-2xl'>
              NURTURING EARLY LEARNERS CURRICULUM
            </CardTitle>
          </CardHeader>

          <CardContent className='grid gap-4 p-0'>
            {[
              'Published by the MOE (Ministry of Education) 2012',
              'Designed for children aged 4 to 6 with 6 core principles, summarized in the “iTeach” framework for best practices in early education.'
            ].map((item, index) => (
              <Card
                key={index}
                className='flex items-start gap-4 p-4 shadow-md'
              >
                <p className='text-sm text-[#0066b3] md:text-base'>{item}</p>
              </Card>
            ))}
          </CardContent>
          <CardContent className='space-y-4 p-0 text-sm text-[#0066b3] md:text-base'>
            <div className='space-y-4 pt-4'>
              <h3 className='text-base font-bold text-[#0066b3] md:text-lg'>
                iTeach
              </h3>
              {[
                { key: 'i', text: 'integrated approach to learning' },
                { key: 'T', text: 'Teachers as facilitators of learning' },
                { key: 'e', text: 'engaging children through purposeful play' },
                {
                  key: 'a',
                  text: 'authentic learning through quality interactions'
                },
                { key: 'c', text: 'children as constructors of knowledge' },
                { key: 'h', text: 'holistic development' }
              ].map((item, index) => (
                <Card
                  key={index}
                  className='flex items-start gap-4 rounded-xl border border-blue-100 bg-white p-4 shadow-md transition hover:shadow-lg'
                >
                  <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white'>
                    {item.key}
                  </div>
                  <p className='text-sm text-[#0066b3] md:text-base'>
                    {item.text}
                  </p>
                </Card>
              ))}
            </div>
          </CardContent>
        </div>
      </div>
    </motion.section>
  );
}
