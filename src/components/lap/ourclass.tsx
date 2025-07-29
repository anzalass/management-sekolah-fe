import Image from 'next/image';
import child1 from '../../../public/childs1.jpg';
import child2 from '../../../public/childs2.jpg';
import child3 from '../../../public/childs3.jpg';
import child4 from '../../../public/playgroup.jpeg';

import Awan from '../../../public/awan.png';
import Awan2 from '../../../public/awan2.png';

export default function OurClass() {
  return (
    <div>
      {' '}
      <div className='relative'>
        {/* Awan Atas */}
        <Image
          width={1000}
          height={1000}
          src={Awan2}
          alt=''
          className='h-[50%] w-full object-contain'
        />
        {/* Konten OUR CLASS */}
        <div className='px-4 py-7'>
          {/* OUR CLASS Title */}
          <div className='mb-10 mt-10 flex justify-center'>
            <div
              className='rounded-[30px] bg-white p-4 text-center text-4xl font-extrabold text-[#017BBD] shadow-md'
              style={{ fontFamily: "'Poetsen One', sans-serif" }}
            >
              OUR CLASS
            </div>
          </div>

          {/* Grid 2x2 */}
          <div className='mt-10 grid w-full grid-cols-1 md:grid-cols-2'>
            {/* Card 1 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 flex h-[70%] w-[70%] items-center justify-center overflow-hidden rounded-2xl border-[6px] border-blue-500 bg-white'>
                <Image
                  src={child1}
                  alt='Preparatory'
                  className='h-full w-full object-cover'
                />
              </div>
              <p className='text-2xl font-bold text-blue-800'>Preparatory</p>
              <p className='text-lg text-gray-700'>Age: 1.5 - 2 Years</p>
            </div>

            {/* Card 2 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 flex h-[70%] w-[70%] items-center justify-center overflow-hidden rounded-2xl border-[6px] border-blue-500 bg-white'>
                <Image
                  src={child2}
                  alt='Toddler'
                  className='h-full w-full object-cover'
                />
              </div>
              <p className='text-2xl font-bold text-blue-800'>Toddler</p>
              <p className='text-lg text-gray-700'>Age: 2 - 3 Years</p>
            </div>

            {/* Card 3 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 flex h-[70%] w-[70%] items-center justify-center overflow-hidden rounded-2xl border-[6px] border-blue-500 bg-white'>
                <Image
                  src={child4}
                  alt='Playgroup'
                  className='h-full w-full object-cover'
                />
              </div>
              <p className='text-2xl font-bold text-blue-800'>Playgroup</p>
              <p className='text-lg text-gray-700'>Age: 3 - 4 Years</p>
            </div>

            {/* Card 4 */}
            <div className='relative z-10 transform text-center transition-transform duration-300 hover:z-20 hover:scale-110'>
              <div className='card mx-auto mb-4 flex h-[70%] w-[70%] items-center justify-center overflow-hidden rounded-2xl border-[6px] border-blue-500 bg-white'>
                <Image
                  src={child3} // Ganti dengan path atau URL gambar
                  alt='Learners & Achievers'
                  className='h-full w-full object-cover'
                />
              </div>
              <p className='text-2xl font-bold text-blue-800'>
                Learners & Achievers
              </p>
              <p className='text-lg text-gray-700'>Age: 4 Years +</p>
            </div>
          </div>
        </div>
        <Image
          width={1000}
          height={1000}
          src={Awan}
          alt=''
          className='h-[70%] w-full object-cover'
        />
      </div>
    </div>
  );
}
