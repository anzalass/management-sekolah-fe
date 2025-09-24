import DetailUjianView from '@/features/siswa-dashboard/kelas/detail-ujian';
import React from 'react';

type PageProps = {
  params: {
    id: string;
    idujian: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <div>
      <DetailUjianView idKelasMapel={params.id} idUjian={params.idujian} />
    </div>
  );
}
