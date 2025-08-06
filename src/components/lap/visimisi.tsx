'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Ellipse from '../../../public/Ellipse.png';

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
      <div className='mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-start lg:justify-center'>
        {/* Kolom Kiri */}
        <div className='hidden items-start justify-start gap-20 lg:flex lg:flex-col'>
          <h2
            className='text-[64px] font-extrabold text-[#017BBD] sm:text-[100px] lg:text-[70px] xl:text-[100px]'
            style={{ fontFamily: "'Poetsen One', sans-serif" }}
          >
            VISION
          </h2>
          <h2
            className='mt-10 text-[64px] font-extrabold text-[#017BBD] sm:text-[100px] lg:text-[70px] xl:text-[100px]'
            style={{ fontFamily: "'Poetsen One', sans-serif" }}
          >
            MISSION
          </h2>
        </div>

        <div className='w-full text-center font-extrabold text-[#017BBD] lg:hidden'>
          <h2 className='text-[30px]'>VISSION AND MISSION</h2>
        </div>

        {/* Kolom Kanan */}
        <div className='flex flex-col gap-6 lg:w-1/2'>
          {/* VISI CONTENT */}
          <div className='rounded-xl bg-[#f9fbfd] p-4 shadow-lg ring-1 ring-gray-200 sm:p-6'>
            <p className='text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl'>
              To be a Pioneer in providing quality space and time for future
              generations preparing them to become the best for the nation, with
              character and moral values as the foundation of life.
            </p>
          </div>

          {/* MISI CONTENT */}
          <ol className='space-y-4'>
            {[
              'To design holistic child development programs using an integrated approach',
              "To facilitate the learning process in order to broaden children's thinking and understanding",
              "To observe and assess children's learning and development",
              "To collaborate with families and communities to support children's learning"
            ].map((item, index) => (
              <li
                key={index}
                className='flex items-start gap-4 rounded-lg bg-white p-4 shadow-md ring-1 ring-gray-200'
              >
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-inner'>
                  {index + 1}
                </div>
                <span className='text-sm text-gray-700 sm:text-base md:text-lg lg:text-xl'>
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </motion.section>
  );
}
