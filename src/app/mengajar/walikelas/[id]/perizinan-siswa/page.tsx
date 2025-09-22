import PerizinanSiswaViewPage from '@/features/mengajar/walikelas/perizinan-siswa-view-page';
import React from 'react';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  return (
    <div className='p-3'>
      <PerizinanSiswaViewPage idKelas={params.id} />
    </div>
  );
}
