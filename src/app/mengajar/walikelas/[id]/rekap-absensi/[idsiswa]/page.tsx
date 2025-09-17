import DetailAbsensiSiswaView from '@/features/mengajar/walikelas/detail-absensi-siswa-view';
type PageProps = {
  params: {
    id: string;
    idsiswa: string;
  };
};

export default async function Page({ params }: PageProps) {
  return (
    <DetailAbsensiSiswaView idKelas={params.id} idSiswa={params.idsiswa} />
  );
}
