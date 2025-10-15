import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import Header from '@/components/layout/header';
import AppSidebarMengajar from '@/components/layout/sidebar-mengajar';
import ProvidersMengajar from '@/components/layout/provider-mengajar';
import KBarMengajar from '@/components/kbar-mengajar';
import { SidebarProvider } from '@/components/ui/sidebar';

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

  return (
    <ProvidersMengajar session={session}>
      <KBarMengajar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className='flex min-h-screen w-full dark:bg-[#08060f]'>
            {/* Sidebar kiri */}
            <AppSidebarMengajar />

            {/* Konten kanan */}
            <div className='flex w-full flex-col overflow-hidden'>
              <Header />
              <main className='w-full overflow-x-auto'>{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </KBarMengajar>
    </ProvidersMengajar>
  );
}
