'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Education from '../../../public/education.png';
import { Check, Sparkles } from 'lucide-react';

type Props = {
  refCurriculum: any;
  inViewCurriculum: boolean;
};

const iteachPrinciples = [
  {
    key: 'i',
    text: 'integrated approach to learning',
    color: 'from-red-500 to-pink-500'
  },
  {
    key: 'T',
    text: 'Teachers as facilitators of learning',
    color: 'from-orange-500 to-red-500'
  },
  {
    key: 'e',
    text: 'engaging children through purposeful play',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    key: 'a',
    text: 'authentic learning through quality interactions',
    color: 'from-green-500 to-emerald-500'
  },
  {
    key: 'c',
    text: 'children as constructors of knowledge',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    key: 'h',
    text: 'holistic development',
    color: 'from-purple-500 to-pink-500'
  }
];

export function CurriculumSection({ refCurriculum, inViewCurriculum }: Props) {
  return (
    <motion.section
      ref={refCurriculum}
      initial={{ opacity: 0, y: 60 }}
      animate={inViewCurriculum ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='mx-auto mt-24 max-w-7xl bg-[#bde0fe] py-16'
    >
      <section className='py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <h2 className='mb-16 text-center text-2xl font-bold text-blue-900 md:text-5xl'>
            OUR CURRICULUM
          </h2>

          <div className='mx-auto grid gap-12 lg:grid-cols-2'>
            {/* Image */}
            <div className='relative'>
              <div className='overflow-hidden'>
                <Image
                  src={Education}
                  height={1000}
                  width={1000}
                  alt='Curriculum'
                  className='ml-4 w-full'
                />
              </div>
              {/* <div className='absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-2xl'>
                <Sparkles className='h-12 w-12 text-yellow-500' />
              </div> */}
            </div>

            {/* Content */}
            <div className='space-y-6'>
              <div className='rounded-2xl bg-white p-6 shadow-lg'>
                <h3 className='mb-4 text-base font-bold text-blue-900 md:text-2xl'>
                  NURTURING EARLY LEARNERS CURRICULUM
                </h3>
                <div className='space-y-3'>
                  <p className='flex items-start gap-3 text-gray-700'>
                    <Check className='mt-1 h-5 w-5 flex-shrink-0 text-green-600' />
                    Published by the MOE (Ministry of Education) 2012
                  </p>
                  <p className='flex items-start gap-3 text-gray-700'>
                    <Check className='mt-1 h-5 w-5 flex-shrink-0 text-green-600' />
                    Designed for children aged 4 to 6 with 6 core principles,
                    summarized in the "iTeach" framework
                  </p>
                </div>
              </div>

              {/* iTeach Principles */}
              <div className='space-y-3'>
                <h4 className='mb-4 text-xl font-bold text-blue-900'>
                  iTeach Framework
                </h4>
                {iteachPrinciples.map((principle, idx) => (
                  <div
                    key={idx}
                    className='rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg'
                  >
                    <div className='flex items-center gap-4'>
                      <div
                        className={`h-12 w-12 rounded-full bg-gradient-to-br ${principle.color} flex flex-shrink-0 items-center justify-center shadow-lg`}
                      >
                        <span className='text-lg font-bold text-white'>
                          {principle.key}
                        </span>
                      </div>
                      <p className='text-gray-700'>{principle.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.section>
  );
}
