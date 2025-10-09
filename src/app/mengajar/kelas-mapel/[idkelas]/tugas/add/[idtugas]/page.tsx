// src/app/mengajar/kelas-mapel/[idkelas]/materi/add/[idmateri]/page.tsx

import TambahMateriView from '@/features/mengajar/kelas-mapel/tambah-materi-kelas-view';
import TambahTugasView from '@/features/mengajar/kelas-mapel/tambah-tugas-view';

type PageProps = {
  params: {
    idkelas: string;
    idtugas: string;
  };
};

export default function AddMateriPage({ params }: PageProps) {
  const { idkelas, idtugas } = params;

  return (
    <div className='px-4'>
      <TambahTugasView idKelas={idkelas} idTugas={idtugas} />
    </div>
  );
}
