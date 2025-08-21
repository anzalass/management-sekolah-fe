'use client';

import Image from 'next/image';
import child1 from '../../../public/childs1.jpg';
import child2 from '../../../public/childs2.jpg';
import child3 from '../../../public/childs3.jpg';
import child4 from '../../../public/playgroup.jpeg';

import Awan from '../../../public/awan.png';
import Awan2 from '../../../public/awan2.png';

export default function OurClass() {
  return (
    <div className='relative overflow-hidden bg-[#bde0fe] py-20'>
      {/* Awan Atas */}
      {/* <Image
        src={Awan2}
        alt='Awan Atas'
        width={1920}
        height={1080}
        className='absolute left-0 top-0 z-10 w-full object-cover'
      /> */}

      {/* Konten */}
      <div className='relative z-10 mx-auto max-w-5xl px-4'>
        {/* OUR CLASS Title */}
        <div className='mb-16 flex justify-center'>
          <div
            className='rounded-[30px] p-4 text-center text-4xl font-extrabold text-[#017BBD] shadow-md'
            style={{ fontFamily: "'Poetsen One', sans-serif" }}
          >
            OUR CLASS
          </div>
        </div>

        {/* Grid Cards */}
        <div className='grid grid-cols-1 gap-y-12 md:gap-10 lg:grid-cols-2'>
          {[
            {
              image: child1,
              title: 'Preparatory',
              age: 'Age: 1.5 - 2 Years'
            },
            {
              image: child2,
              title: 'Toddler',
              age: 'Age: 2 - 3 Years'
            },
            {
              image: child4,
              title: 'Playgroup',
              age: 'Age: 3 - 4 Years'
            },
            {
              image: child3,
              title: 'Learners & Achievers',
              age: 'Age: 4 Years +'
            }
          ].map((item, index) => (
            <div
              key={index}
              className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-105'
            >
              <div className='card mx-auto mb-4 flex w-[85%] max-w-md items-center justify-center overflow-hidden rounded-2xl border-[6px] border-blue-500 bg-white'>
                <Image
                  src={item.image}
                  alt={item.title}
                  className='aspect-[3/2] h-full w-full object-cover'
                />
              </div>
              <p className='text-2xl font-bold text-blue-900'>{item.title}</p>
              <p className='text-lg text-blue-800'>{item.age}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Awan Bawah */}
      {/* <Image
        src={Awan}
        alt='Awan Bawah'
        width={1920}
        height={1080}
        className='absolute bottom-0 left-0 z-0 w-full rotate-180 object-cover'
      /> */}
    </div>
  );
}
