import { auth } from '@/lib/auth';

import Header from '@/components/layout/header';
import Providers from '@/components/layout/providers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AppSidebarMengajar from '@/components/layout/sidebar-mengajar';
import KBarMengajar from '@/components/kbar-mengajar';
// import { setApiToken } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Little Alley',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  const session = await auth();

  // **SET TOKEN SEKALI DI SINI**
  // setApiToken(session?.user?.token || null);

  return (
    <Providers session={session}>
      <KBarMengajar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebarMengajar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </KBarMengajar>
    </Providers>
  );
}
