import RekapAbsensiByKelasView from '@/features/mengajar/walikelas/rekap-absensi-view';
import RekapNilaiTable from '@/features/mengajar/walikelas/rekap-nilai-view';

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  return (
    <div>
      <RekapNilaiTable idKelas={params.id} />
    </div>
  );
}
