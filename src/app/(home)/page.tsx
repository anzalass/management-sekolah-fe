import HomeView from '../../components/home/home-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Little Alley',
  description: 'Sekolah Terbaik di Suvarna Sutera'
};

export default function Page() {
  return <HomeView />;
}
