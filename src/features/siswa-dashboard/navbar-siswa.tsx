import { Arrow } from '@radix-ui/react-dropdown-menu';
import { ArrowLeft, StepBack } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function NavbarSiswa({ title }: { title: string }) {
  const { data: session } = useSession();
  const firstInitial = session?.user?.nama?.split(' ')[0]?.[0] || '';
  const secondInitial = session?.user?.nama?.split(' ')[1]?.[0] || '';

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between'>
      {' '}
      <div className='relative flex w-full items-center justify-between bg-blue-800 px-2 py-6 pb-4 text-white'>
        {/* Tombol Back */}
        <Link
          href={'/siswa'}
          className='flex items-center gap-1 text-white hover:opacity-80'
        >
          <ArrowLeft />
        </Link>

        <h1 className='text-lg font-semibold'>{title}</h1>

        <div className='h-10 w-10 overflow-hidden rounded-full border-2 border-white'>
          <Image
            src={
              session?.user?.foto
                ? session?.user?.foto
                : `https://ui-avatars.com/api/?name=${firstInitial}+${secondInitial}&background=random&format=png`
            }
            alt='Foto User'
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  );
}
