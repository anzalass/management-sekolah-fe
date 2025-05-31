import React, { useState } from 'react';
import Logo from '../../../public/Logo.png';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='relative z-10 mx-auto bg-white shadow-md'>
      <div className='relative mx-auto flex w-11/12 items-center justify-between px-6 py-4'>
        <div className='flex items-center'>
          <div className='absolute left-0 top-1 z-20 flex h-[80px] w-[80px] items-center justify-center md:top-1 md:rounded-full lg:-top-1 lg:left-[-8px] lg:h-[145px] lg:w-[151px] lg:bg-white lg:shadow-xl'>
            <a href='/'>
              <Image
                alt='Yayasan Tunas Anak Mulia logo'
                className='h-[60px] w-[70px] object-contain lg:h-[120px] lg:w-[120px]'
                src={Logo}
              />
            </a>
          </div>
          <div className='md:ml-18 ml-[60px] lg:ml-[130px]'>
            <h1 className='text-2xl font-extrabold'>YAYASAN</h1>
            <p className='inline text-sm font-semibold'>TUNAS ANAK MULIA</p>
          </div>
        </div>
        <button className='z-30 lg:hidden' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav
          className={`font-montserrat absolute left-[-20] top-[100%] w-screen flex-col space-y-4 bg-white px-6 py-6 shadow-md transition-all duration-300 ease-in-out md:absolute md:ml-[-18px] md:w-[108%] md:w-screen md:flex-col md:space-y-6 md:py-0 md:py-6 lg:static lg:flex lg:w-auto lg:flex-row lg:space-x-12 lg:space-y-0 lg:bg-transparent lg:px-0 lg:shadow-none ${
            isOpen ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <a
            className='pt-2 font-semibold text-gray-700 hover:text-gray-900 md:ml-2 lg:ml-0'
            href='/little-alley-preschool'
          >
            Little Alley Preschool
          </a>
          <a
            className='pt-2 font-semibold text-gray-700 hover:text-gray-900 md:ml-2 lg:ml-0'
            href='/little-alley-cyberschool'
          >
            Little Alley CyberSchool
          </a>
          <a
            className='rounded-full bg-black px-4 py-2 text-center text-white hover:bg-gray-800'
            href='/register'
          >
            Join Us
          </a>
        </nav>
      </div>
    </header>
  );
}
