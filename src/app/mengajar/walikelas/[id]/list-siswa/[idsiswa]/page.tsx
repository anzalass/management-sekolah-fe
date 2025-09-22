import RapotView from '@/features/mengajar/walikelas/rapot-view';

type PageProps = {
  params: Promise<{
    idsiswa: string;
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id, idsiswa } = await params; // ✅ wajib di-await

  return <RapotView idKelas={id} idSiswa={idsiswa} />;
}
