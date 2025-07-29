import Image from 'next/image';
import logo2 from '../../../public/logo2.png';

export default function Jumbotron() {
  return (
    <div className='bg-lap relative z-0 flex flex-wrap items-start justify-center gap-10 bg-cover bg-center p-4 pt-28'>
      <div className='absolute inset-0 z-0 bg-black bg-opacity-40'></div>
      <div className='tes relative z-10 ml-[-35px] flex w-full flex-col items-start p-10 text-white md:w-1/2 lg:ml-0 lg:ml-[-100px]'>
        <h1
          className='pb-7 text-3xl font-bold sm:text-4xl md:text-5xl'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          A HAPPY
        </h1>
        <h1
          className='w-[400px] pb-10 text-3xl font-bold sm:text-4xl md:text-5xl lg:w-auto'
          style={{ fontFamily: "'Poetsen One', sans-serif" }}
        >
          PRE-SCHOOL
        </h1>
        <p className='font-montserrat pb-1 text-lg font-bold'>
          Where every day is an unforgettable
        </p>
        <p className='font-montserrat pb-7 text-lg font-bold'>
          adventure of learning
        </p>
        <div className='flex gap-4 sm:flex-row'>
          <a href='/register'>
            <button className='rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700'>
              Join Us
            </button>
          </a>
          <a href='#about'>
            <button className='rounded border border-white bg-transparent px-6 py-2 font-semibold text-white hover:bg-white/20'>
              Learn More
            </button>
          </a>
        </div>
      </div>
      <div className='relative z-10 flex w-full justify-end pr-4 md:w-[500px]'>
        <Image
          width={1000}
          height={1000}
          src={logo2}
          alt='Logo'
          className='absolute right-[-110px] top-[-32rem] h-40 object-contain md:left-72 md:right-auto lg:relative lg:left-20 lg:top-[-110px] lg:ml-44 lg:h-60'
        />
      </div>
    </div>
  );
}
