import MengajarViewPage from '@/features/mengajar/mengajar-view';
import { RenderTriggerProvider } from '@/hooks/use-rendertrigger';
import { searchParamsCache, serialize } from '@/lib/searchparams';

import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Dashboard: Kegiatan Sekolah'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <RenderTriggerProvider>
      <MengajarViewPage />
    </RenderTriggerProvider>
  );
}
