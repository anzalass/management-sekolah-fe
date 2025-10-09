// src/app/mengajar/kelas-mapel/[idkelas]/materi/add/[idmateri]/page.tsx

import TambahMateriView from '@/features/mengajar/kelas-mapel/tambah-materi-kelas-view';

type PageProps = {
  params: {
    idkelas: string;
    idmateri: string;
  };
};

export default function AddMateriPage({ params }: PageProps) {
  const { idkelas, idmateri } = params;

  return (
    <div className='px-4'>
      <TambahMateriView idKelas={idkelas} idMateri={idmateri} />
    </div>
  );
}
