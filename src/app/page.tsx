import HomeView from '@/components/home/home-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Little Alley - Sekolah Terbaik di Suvarna Sutera',
  description:
    'Selamat datang di Little Alley School, yayasan pendidikan anak terbaik.'
};

export default function HomePage() {
  return <HomeView />;
}
