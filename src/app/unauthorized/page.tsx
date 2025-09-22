import Unauthorized from '@/components/layout/unauthorized';
import { SessionProvider } from 'next-auth/react';

export default function Page() {
  return (
    <SessionProvider>
      <Unauthorized />
    </SessionProvider>
  );
}
