import RekapAbsensiByKelasView from '@/features/mengajar/walikelas/rekap-absensi-view';
import React from 'react';

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  return (
    <div>
      <RekapAbsensiByKelasView idKelas={params.id} />
    </div>
  );
}
