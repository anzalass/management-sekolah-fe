'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Ellipse from '../../../public/Ellipse.png';
import { Target } from 'lucide-react';

type Props = {
  refVision: any;
  showVision: boolean;
};

export function VisionAndMission({ refVision, showVision }: Props) {
  return (
    <motion.section
      ref={refVision}
      initial={{ opacity: 0, y: 50 }}
      animate={showVision ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='mt-20 bg-white px-4 py-10 sm:px-6 md:px-10 lg:px-20'
    >
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid gap-12 lg:grid-cols-12'>
            {/* Left - Titles */}
            <div className='hidden flex-col gap-12 lg:col-span-4 lg:flex'>
              <h2 className='text-7xl font-bold text-blue-600'>VISION</h2>
              <h2 className='mt-32 text-7xl font-bold text-blue-600'>
                MISSION
              </h2>
            </div>

            {/* Mobile Title */}
            <div className='text-center lg:hidden'>
              <h2 className='text-4xl font-bold text-blue-600'>
                VISION & MISSION
              </h2>
            </div>

            {/* Right - Content */}
            <div className='space-y-8 lg:col-span-8'>
              {/* Vision Card */}
              <div className='rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-xl'>
                <div className='mb-4 flex items-start gap-4'>
                  <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600'>
                    <Target className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='mb-3 text-2xl font-bold text-blue-900'>
                      Our Vision
                    </h3>
                    <p className='text-lg leading-relaxed text-blue-800'>
                      To be a Pioneer in providing quality space and time for
                      future generations, preparing them to become the best for
                      the nation, with character and moral values as the
                      foundation of life.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission Cards */}
              <div className='space-y-4'>
                {[
                  'To design holistic child development programs using an integrated approach',
                  "To facilitate the learning process in order to broaden children's thinking and understanding",
                  "To observe and assess children's learning and development",
                  "To collaborate with families and communities to support children's learning"
                ].map((mission, idx) => (
                  <div
                    key={idx}
                    className='rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:-translate-x-2 hover:shadow-xl'
                  >
                    <div className='flex items-start gap-4'>
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600'>
                        <span className='font-bold text-white'>{idx + 1}</span>
                      </div>
                      <p className='pt-1 leading-relaxed text-gray-700'>
                        {mission}
                      </p>
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
