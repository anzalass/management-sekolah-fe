import DetailPengumumanView from '@/features/siswa-dashboard/pengumuman/detail-pengumuman-view';
import React from 'react';
type PageProps = { params: Promise<{ id: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  return <DetailPengumumanView id={params.id} />;
}
