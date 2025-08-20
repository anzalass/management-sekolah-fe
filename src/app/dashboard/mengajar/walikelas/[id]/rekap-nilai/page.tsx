import RekapNilaiTable from '@/features/mengajar/walikelas/rekap-nilai-view';

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  return (
    <div className='max-w-full overflow-x-auto'>
      <div className='min-w-max'>
        <RekapNilaiTable idKelas={params.id} />
      </div>
    </div>
  );
}
