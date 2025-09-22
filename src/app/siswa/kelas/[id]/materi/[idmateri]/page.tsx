import PageContainer from '@/components/layout/page-container';
import DetailMateriView from '@/features/siswa-dashboard/kelas/detail-materi-view';

type PageProps = {
  params: {
    id: string;
    idmateri: string;
  };
};

export default async function Page({ params }: PageProps) {
  return <DetailMateriView idKelas={params.id} idMateri={params.idmateri} />;
}
