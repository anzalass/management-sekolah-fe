import Image from 'next/image';
import React from 'react';

interface GalleryItem {
  image: string;
}

interface GalleryProps {
  gallery: GalleryItem[];
}

export default function Gallery({ gallery }: GalleryProps) {
  return (
    <div className='bg-white px-4 py-10 text-center md:px-16'>
      <h2
        className='mb-10 text-4xl font-extrabold text-[#017BBD]'
        style={{ fontFamily: "'Poetsen One', sans-serif" }}
      >
        GALLERY
      </h2>

      <div className='mt-14 overflow-hidden'>
        <div className='animate-scroll-images flex gap-4 will-change-transform'>
          {gallery.concat(gallery).map((item, index) => (
            <div key={index} className='flex-shrink-0'>
              <Image
                src={item.image}
                alt={`Gallery ${index + 1}`}
                width={256}
                height={160}
                quality={70} // ✅ lebih ringan tapi masih tajam
                placeholder='blur' // ✅ tampil cepat dengan efek blur
                blurDataURL={item.image} // gunakan gambar kecil sementara
                priority={index < 4} // ✅ muat cepat 4 gambar pertama
                loading={index < 4 ? 'eager' : 'lazy'} // eager: langsung render
                className='h-40 w-64 rounded-lg object-cover shadow transition-transform duration-500 hover:scale-105'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
