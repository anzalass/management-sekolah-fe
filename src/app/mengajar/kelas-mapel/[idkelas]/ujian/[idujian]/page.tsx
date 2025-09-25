import PageContainer from '@/components/layout/page-container';
import DetailUjianView from '@/features/mengajar/kelas-mapel/detail-ujian-view';
import MateriView from '@/features/mengajar/kelas-mapel/materi-view';

type PageProps = {
  params: {
    idkelas: string;
    idujian: string;
  };
};

export default async function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <DetailUjianView id={params.idujian} />
      </div>
    </PageContainer>
  );
}
