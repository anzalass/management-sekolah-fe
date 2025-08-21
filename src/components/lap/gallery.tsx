import { API } from '@/lib/server';
import Image from 'next/image';
import React from 'react';

interface GalleryItem {
  image: string;
}

interface GalleryProps {
  gallery: GalleryItem[];
}

export default function Gallery({ gallery }: GalleryProps) {
  const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}view-image`;

  return (
    <div className='bg-white px-4 py-10 text-center md:px-16'>
      <h2
        className='mb-10 text-4xl font-extrabold text-[#017BBD]'
        style={{ fontFamily: "'Poetsen One', sans-serif" }}
      >
        GALLERY
      </h2>
      <div className='mt-14 overflow-hidden'>
        <div className='animate-scroll-images flex gap-4'>
          {gallery.concat(gallery).map((item, index) => {
            // Extract the image URL here

            return (
              <div key={index} className='flex-shrink-0'>
                <Image
                  width={1000}
                  height={1000}
                  src={item.image} // Use imageUrl here
                  alt={`Facility ${index + 1}`}
                  className='h-40 w-64 rounded-lg object-cover shadow'
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
