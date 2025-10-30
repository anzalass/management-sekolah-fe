import React from 'react';
import NavbarSiswa from './navbar-siswa';

type Data = {
  label: string;
  value: string | number;
  color?: string; // biar bisa custom warna kalau perlu
};

type Props = {
  title: string;
  titleContent: string;
  mainContent: string | number;
  icon: React.ReactNode;
  data: Data[];
};

export default function HeaderSiswa({
  title,
  titleContent,
  mainContent,
  icon,
  data
}: Props) {
  return (
    <div
      className={`${process.env.NEXT_PUBLIC_THEME_COLOR} pb-${title !== 'Payment' ? '14' : '24'}`}
    >
      <div className='mx-auto max-w-6xl'>
        <NavbarSiswa title={title} />
        {/* Summary Card */}
        <div className='px-4'>
          <div className='rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm text-blue-100'>{titleContent}</p>
                <p className='text-2xl font-bold text-white'>{mainContent}</p>
              </div>
              <div className='flex h-14 w-14 items-center justify-center rounded-full bg-white/20'>
                {icon}
              </div>
            </div>

            {/* Dynamic Grid */}
            {data.length > 0 && (
              <div
                className={`mt-4 grid grid-cols-${data.length} gap-2 border-t border-white/20 pt-4`}
              >
                {data.map((item, i) => (
                  <div key={i} className='text-center'>
                    <p
                      className={`text-2xl font-bold ${
                        item.color || 'text-white'
                      }`}
                    >
                      {item.value}
                    </p>
                    <p className='text-xs text-blue-100'>{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
