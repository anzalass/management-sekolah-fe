'use client';

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch
} from 'kbar';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import RenderResults from './render-result';
import useThemeSwitching from './use-theme-switching';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

export default function KBarMengajar({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [dataSidebar, setDataSidebar] = React.useState<any[]>([]);
  const { data: session } = useSession();

  const navigateTo = (url: string) => {
    router.push(url);
  };

  const getDataSidebar = async () => {
    try {
      const res = await api.get('sidebar', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      // cek log
      // pastikan array
      setDataSidebar(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {}
  };

  React.useEffect(() => {
    if (session?.user?.token) {
      getDataSidebar();
    }
  }, [session]);

  // Actions untuk KBar
  const actions = useMemo(
    () =>
      (Array.isArray(dataSidebar) ? dataSidebar : []).flatMap(
        (navItem: any) => {
          const baseAction =
            navItem.url && navItem.url !== '#'
              ? {
                  id: `${navItem.title.toLowerCase()}Action`,
                  name: navItem.title,
                  shortcut: navItem.shortcut,
                  keywords: navItem.title.toLowerCase(),
                  section: 'Navigation',
                  subtitle: `Go to ${navItem.title}`,
                  perform: () => navigateTo(navItem.url)
                }
              : null;

          const childActions =
            navItem?.items?.map((childItem: any, idx: number) => ({
              id: `${navItem.title.toLowerCase()}-${idx}-${childItem.title.toLowerCase()}Action`,
              name: childItem.title,
              shortcut: childItem.shortcut,
              keywords: childItem.title.toLowerCase(),
              section: navItem.title,
              subtitle: `Go to ${childItem.title}`,
              perform: () => navigateTo(childItem.url)
            })) ?? [];

          return baseAction ? [baseAction, ...childActions] : childActions;
        }
      ),
    [dataSidebar] // penting supaya rerun saat dataSidebar berubah
  );

  return (
    <KBarProvider key={JSON.stringify(actions)} actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}

const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='scrollbar-hide fixed inset-0 z-[99999] bg-black/80 !p-0 backdrop-blur-sm'>
          <KBarAnimator className='relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-background text-foreground shadow-lg'>
            <div className='bg-background'>
              <div className='border-x-0 border-b-2'>
                <KBarSearch className='w-full border-none bg-background px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0' />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
