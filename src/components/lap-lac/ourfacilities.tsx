'use client';

import Image from 'next/image';
import React from 'react';
import { Check, Home } from 'lucide-react';

type Props = {
  fasilitasImages: any[];
  fasilities: string[];
};

export default function OurFacilities({ fasilitasImages, fasilities }: Props) {
  return (
    <section className='bg-white py-20'>
      <div className='mx-auto max-w-6xl px-4'>
        {/* ✅ Heading */}
        <h2
          className='mb-16 text-center text-5xl font-bold text-blue-900'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          OUR FACILITIES
        </h2>

        {/* ✅ Optimized Grid Gambar */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {fasilitasImages.map((item, index) => (
            <div
              key={index}
              className='relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg'
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className='object-cover transition-transform duration-500 hover:scale-110'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                priority={index === 0} // ✅ hanya gambar pertama diprioritaskan
                quality={70} // ✅ kurangi kualitas untuk percepat loading, tetap tajam
                placeholder='blur' // ✅ blur placeholder
                blurDataURL='/blur-placeholder.png' // optional: placeholder kecil 5–10KB
              />
            </div>
          ))}
        </div>

        {/* ✅ List Fasilitas */}
        <div className='rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-xl'>
          <h3 className='mb-6 flex items-center gap-3 text-2xl font-bold text-blue-900'>
            <Home className='h-8 w-8 text-blue-800' />
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
