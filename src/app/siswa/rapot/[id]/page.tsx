import RapotView from '@/features/mengajar/walikelas/rapot-view';
import PelanggaranPrestasiViewPage from '@/features/pelanggaran-prestasi/pelanggaran-prestasi-view';
import DetailRapotView from '@/features/siswa-dashboard/rapot/detail-rapot-view';

type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <div className='flex-1 space-y-4'>
      <DetailRapotView idKelas={params.id} />
    </div>
  );
}
