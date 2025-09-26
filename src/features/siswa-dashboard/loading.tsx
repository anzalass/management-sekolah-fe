import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: number; // ukuran icon
}

export default function Loading({
  message = 'Loading...',
  size = 32
}: LoadingProps) {
  return (
    <div className='flex flex-col items-center justify-center py-10'>
      <Loader2 className={`animate-spin text-primary`} size={size} />
      <p className='mt-4 text-sm text-gray-500'>{message}</p>
    </div>
  );
}
