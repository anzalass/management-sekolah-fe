import Image from 'next/image';
import banner from '../../../public/banner.svg';

export default function Jumbotron() {
  return (
    <div className='relative mx-auto'>
      <Image
        src={banner}
        width={1000}
        height={1000}
        className='w-full'
        alt='banner'
      />
      <div className='mx-auto flex w-full items-center justify-center py-10'>
        <div className='flex items-center justify-center gap-6'>
          <a href='/pendaftaran-siswa'>
            <button className='min-w-[40%] rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 lg:min-w-[350px]'>
              Join Us
            </button>
          </a>
          <a href='#about'>
            <button className='min-w-[40%] rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 lg:min-w-[350px]'>
              Learn More
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
