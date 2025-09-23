import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import ProvidersSiswa from '@/components/layout/provider-siswa';
// import { setApiToken } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Little Alley',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function SiswaLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  const session = await auth();

  // **SET TOKEN SEKALI DI SINI**
  // setApiToken(session?.user?.token || null);

  return <ProvidersSiswa session={session}>{children}</ProvidersSiswa>;
}
