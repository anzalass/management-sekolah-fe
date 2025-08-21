// RootLayout.tsx
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

// Import the RenderTriggerProvider here
import { RenderTriggerProvider } from '@/hooks/use-rendertrigger';

export const metadata: Metadata = {
  title: 'Little Alley School',
  description: 'Yayasan Anak Tunas Mulia',
  icons: {
    icon: '/vercel.svg' // path ke favicon
  }
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${lato.className}`} suppressHydrationWarning>
      <body className={''}>
        <NextTopLoader showSpinner={false} />

        {/* Wrap the entire layout with RenderTriggerProvider */}
        <RenderTriggerProvider>
          <NuqsAdapter>
            <Toaster />
            {children}
          </NuqsAdapter>
        </RenderTriggerProvider>
      </body>
    </html>
  );
}
