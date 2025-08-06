import PageContainer from '@/components/layout/page-container';
import TugasView from '@/features/kelas-mapel/tugas-view';

type PageProps = {
  params: {
    idkelas: string;
    idtugas: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <TugasView id={params.idtugas} />
      </div>
    </PageContainer>
  );
}
