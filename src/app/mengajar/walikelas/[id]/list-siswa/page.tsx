import ListSiswaView from '@/features/mengajar/walikelas/list-siswa-view';
import React from 'react';

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  return <ListSiswaView idKelas={params.id} />;
}
