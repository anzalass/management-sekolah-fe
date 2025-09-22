import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Logo from '../../../public/Logo.png';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='relative z-10 w-full bg-white shadow-md'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4'>
        {/* Logo dan Nama */}
        <div className='flex items-center gap-3'>
          <div className='relative h-14 w-14 lg:h-[80px] lg:w-[80px]'>
            <Link href='/'>
              <Image
                src={Logo}
                alt='Yayasan Tunas Anak Mulia'
                fill
                className='object-contain'
              />
            </Link>
          </div>
          <div className='leading-tight'>
            <h1 className='text-lg font-extrabold lg:text-xl'>YAYASAN</h1>
            <p className='text-sm font-semibold'>TUNAS ANAK MULIA</p>
          </div>
        </div>

        {/* Tombol Hamburger */}
        <button className='z-30 lg:hidden' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu Navigasi */}
        <nav
          className={`font-montserrat absolute left-0 right-0 top-full w-full flex-col space-y-2 bg-white px-6 py-6 transition-all duration-300 ease-in-out lg:static lg:flex lg:w-auto lg:flex-row lg:space-x-2 lg:space-y-0 lg:bg-transparent lg:px-0 lg:shadow-none ${
            isOpen ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <Link
            href='/little-alley-preschool'
            className='px-2 py-2 font-semibold text-gray-700 hover:text-black'
          >
            Little Alley Preschool
          </Link>
          <Link
            href='/little-alley-cyberschool'
            className='py-2 pl-2 pr-4 font-semibold text-gray-700 hover:text-black'
          >
            Little Alley CyberSchool
          </Link>
          <Link
            href='/login-siswa'
            className='rounded-full bg-black px-4 py-2 text-center text-white hover:bg-gray-800'
          >
            Student Apps
          </Link>
          <Link
            href='/pendaftaran-siswa'
            className='rounded-full bg-black px-4 py-2 text-center text-white hover:bg-gray-800'
          >
            Join Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
