import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface TestimonialItem {
  parentName: string;
  image: string;
  description: string;
}

type TestimonialProps = {
  testimonials: TestimonialItem[];
  setSwiperInstance: (instance: any) => void;
  swiperInstance: any;
};

export default function Testimonial({
  testimonials,
  swiperInstance,
  setSwiperInstance
}: TestimonialProps) {
  return (
    <div className='mt-10 bg-[#bde0fe] font-sans'>
      <div className='mx-auto max-w-5xl px-4 py-10'>
        <div className='mb-8 text-center'>
          <h2 className='text-4xl font-extrabold text-[#003049]'>
            TESTIMONIAL
          </h2>
          <p className='text-sm italic text-[#003049] md:text-base'>
            Hear From Our Parents
          </p>
        </div>

        <Swiper
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          loop
          autoplay={{
            delay: 4000,
            disableOnInteraction: false
          }}
          navigation={false}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className='mx-auto flex h-[340px] w-full max-w-[250px] flex-col overflow-hidden rounded-3xl bg-white shadow-lg'>
                <div className='relative h-40 w-full'>
                  <Image
                    key={index}
                    src={item.image}
                    alt={`Foto ${item.parentName}`}
                    fill
                    className='object-cover'
                    {...(index === 0
                      ? { priority: true } // preload hanya pertama
                      : { loading: 'lazy' })} // lainnya lazy
                  />
                </div>

                <div className='flex flex-1 flex-col p-4'>
                  <p className='font-bold'>{item.parentName}</p>
                  <p className='hyphens-auto break-words text-justify text-xs italic leading-relaxed text-[#003049] md:text-sm'>
                    “{item.description}”
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className='mb-3 mt-14 flex justify-center space-x-4'>
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 transition hover:bg-blue-500 hover:text-white'
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 transition hover:bg-blue-500 hover:text-white'
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
