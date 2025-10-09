import Image from 'next/image';
import React from 'react';

import { Check, Home } from 'lucide-react';

export default function OurFacilities({
  fasilitasImages,
  fasilities
}: {
  fasilitasImages: any[];
  fasilities: any[];
}) {
  return (
    <section className='bg-white py-20'>
      <div className='mx-auto max-w-6xl px-4'>
        <h2 className='mb-16 text-center text-5xl font-bold text-blue-900'>
          OUR FACILITIES
        </h2>

        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {fasilitasImages.map((item, index) => (
            <div
              key={index}
              className='w-full overflow-hidden rounded-lg shadow'
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                placeholder='blur' // ✅ tampil blur dulu (perceived faster)
                priority={index < 2} // ✅ 2 gambar pertama dimuat lebih dulu
                loading={index < 2 ? 'eager' : 'lazy'} // eager = langsung render
                className='h-auto w-full transform rounded-lg transition-transform duration-300 hover:z-20 hover:scale-110'
              />
            </div>
          ))}
        </div>

        <div className='rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-xl'>
          <h3 className='mb-6 flex items-center gap-3 text-2xl font-bold text-blue-900'>
            <Home className='h-8 w-8' />
            Equipped to Enhance Learning
          </h3>
          <div className='grid gap-4 md:grid-cols-2'>
            {fasilities.map((facility, idx) => (
              <div key={idx} className='flex items-center gap-3'>
                <Check className='h-5 w-5 flex-shrink-0 text-green-600' />
                <p className='text-gray-700'>{facility}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
