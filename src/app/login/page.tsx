import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sigin-view';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

export default async function Page() {
  let stars = 3000; // Default value

  try {
    const response = await fetch(
      'https://api.github.com/repos/kiranism/next-shadcn-dashboard-starter',
      {
        next: { revalidate: 3600 }
      }
    );

    if (response.ok) {
      const data = await response.json();
      stars = data.stargazers_count || stars;
    }
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
  }

  // 🛠 Bungkus Client Component di <Suspense>
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInViewPage stars={stars} />
    </Suspense>
  );
}
