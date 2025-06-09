import KBar from '@/components/kbar';
import { auth } from '@/lib/auth';

import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import Providers from '@/components/layout/providers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Little Alley',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  const session = await auth();
  return (
    <KBar>
      <Providers session={session}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {/* page main content */}
            {children}
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </Providers>
    </KBar>
  );
}
