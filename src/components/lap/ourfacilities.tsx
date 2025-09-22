import Image from 'next/image';
import React from 'react';

import Fasilitas1 from '../../../public/fasilitas1.jpg';
import Fasilitas2 from '../../../public/fasilitas2.jpg';
import Fasilitas3 from '../../../public/fasilitas3.jpg';
import Fasilitas4 from '../../../public/fasilitas4.jpg';
import Fasilitas5 from '../../../public/fasilitas5.jpg';
import Fasilitas6 from '../../../public/fasilitas6.jpg';
import Fasilitas7 from '../../../public/fasilitas7.jpg';

export default function OurFacilities() {
  return (
    <div className='mx-auto mt-24 w-11/12 px-4 py-8 2xl:max-w-7xl'>
      <h2
        className='mb-6 text-center text-4xl font-extrabold text-[#017BBD]'
        style={{ fontFamily: "'Poetsen One', sans-serif" }}
      >
        OUR FACILITIES
      </h2>

      <div className='mt-14 grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2'>
        <Image
          width={1000}
          height={1000}
          src={Fasilitas1}
          alt='Facility 1'
          className='w-[100%] transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
        />
        <Image
          width={1000}
          height={1000}
          src={Fasilitas2}
          alt='Facility 2'
          className='w-[100%] transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
        />
        <Image
          width={1000}
          height={1000}
          src={Fasilitas3}
          alt='Facility 3'
          className='w-[100%] transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
        />
        <Image
          width={1000}
          height={1000}
          src={Fasilitas4}
          alt='Facility 4'
          className='w-[100%] transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
        />
        <Image
          width={1000}
          height={1000}
          src={Fasilitas5}
          alt='Facility 1'
          className='w-[100%] transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
        />
        <Image
          width={1000}
          height={1000}
          src={Fasilitas6}
          alt='Facility 2'
          className='w-[100%] transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
        />
        <Image
          width={1000}
          height={1000}
          src={Fasilitas7}
          alt='Facility 3'
          className='w-[100%] transform rounded-lg shadow transition-transform duration-300 hover:z-20 hover:scale-110'
        />

        <div className='mb-6 mt-9 block w-[100%]'>
          <p className='text-base leading-relaxed text-[#0066b3] md:text-xl'>
            Yayasan Tunas Anak Mulia is equipped with facilities and resources
            to enhance the learning experience:
          </p>
          <ul className='mt-2 list-inside list-disc space-y-1 text-base leading-relaxed text-[#0066b3] md:text-xl'>
            <li>Spacious and Safe Learning</li>
            <li>Environment Well-Equipped</li>
            <li>Classrooms Library and Resource</li>
            <li>Center Playgrounds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
