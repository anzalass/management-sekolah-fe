import LacView from '@/components/lap-lac/lac-view';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Little Alley Cyberschool',
  description: 'Sekolah Terbaik di Suvarna Sutera'
};
export default function Page() {
  return <LacView />;
}
