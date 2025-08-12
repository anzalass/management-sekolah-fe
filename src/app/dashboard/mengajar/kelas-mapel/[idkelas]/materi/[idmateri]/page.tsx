import PageContainer from '@/components/layout/page-container';
import MateriView from '@/features/mengajar/kelas-mapel/materi-view';

type PageProps = {
  params: {
    idkelas: string;
    idmateri: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <MateriView id={params.idmateri} />
      </div>
    </PageContainer>
  );
}
