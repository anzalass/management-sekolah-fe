import { StepBack } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

export default function NavbarSiswa({ title }: { title: string }) {
  const { data: session } = useSession();
  const firstInitial = session?.user?.nama?.split(' ')[0]?.[0] || '';
  const secondInitial = session?.user?.nama?.split(' ')[1]?.[0] || '';

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between'>
      {' '}
      <div className='relative flex h-[10vh] w-full items-center justify-between rounded-b-lg bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
        {/* Tombol Back */}
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-1 text-white hover:opacity-80'
        >
          <StepBack />
        </button>

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
