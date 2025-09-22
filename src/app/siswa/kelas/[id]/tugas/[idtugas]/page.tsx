import PageContainer from '@/components/layout/page-container';
import DetailTugasView from '@/features/siswa-dashboard/kelas/detail-tugas-view';

type PageProps = {
  params: {
    id: string;
    idtugas: string;
  };
};

export default async function Page({ params }: PageProps) {
  return <DetailTugasView idTugas={params.idtugas} idKelasMapel={params.id} />;
}
