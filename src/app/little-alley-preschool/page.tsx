import LapView from '@/components/lap-lac/lap-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Little Alley Preschool',
  description: 'Sekolah Terbaik di Suvarna Sutera'
};

export default function Page() {
  return <LapView />;
}
