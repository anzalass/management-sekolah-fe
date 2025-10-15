// app/layout.tsx
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { RenderTriggerProvider } from '@/hooks/use-rendertrigger';

export const metadata: Metadata = {
  title: 'Little Alley School',
  description: 'Yayasan Tunas Anak Mulia - Pendidikan Anak Berkualitas',
  icons: { icon: '/vercel.svg' },
  robots: 'index, follow',
  alternates: { canonical: 'https://yayasantunasanakmulia.sch.id/' }
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='id'
      translate='no'
      className={lato.className}
      suppressHydrationWarning
    >
      {/* Manifest untuk PWA */}
      <link rel='manifest' href='/manifest.json' />
      <head>
        <meta
          httpEquiv='Content-Security-Policy'
          content="frame-ancestors 'self' https://*; frame-src https://docs.google.com https://forms.gle https://*.google.com https://*.gstatic.com 'self';"
        />
      </head>

      <body className='bg-white text-black'>
        {/* Top loader saat navigasi */}
        <NextTopLoader showSpinner={false} />

        {/* Wrap app dengan provider */}
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
