import Image from 'next/image';
import Link from 'next/link';

export default function Jumbotron({
  banner,
  title1,
  title2,
  title3,
  content
}: {
  banner: any;
  title1: string;
  title2: string;
  title3: string;
  content: string;
}) {
  return (
    <div className='relative h-[70vh] w-full overflow-hidden md:h-[80vh]'>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <Image
          src={banner}
          alt='banner'
          fill
          priority
          className='object-cover object-center md:object-[center_top]'
        />
        {/* Overlay */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 flex h-full items-center justify-center'>
        <div className='max-w-6xl animate-[fadeInUp_1s_ease-out] px-6 text-center'>
          <div className='mb-6 inline-block rounded-full bg-white/20 px-6 py-2 backdrop-blur-sm'>
            <span className='font-semibold text-white'>{title1}</span>
          </div>

          <h1 className='mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-7xl'>
            {title2}
            <br />
            {title3}
          </h1>

          <p className='mb-8 text-base text-blue-100 sm:text-lg md:text-2xl'>
            {content}
          </p>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Link href={'/pendaftaran-siswa'}>
              <button className='transform rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-2xl'>
                Join Us
              </button>
            </Link>
            {/* 
            <button className='rounded-full border-2 border-white bg-white/20 px-10 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30'>
              Learn More
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
