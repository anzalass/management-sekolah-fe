'use client';

import { AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'Data Tidak Ditemukan',
  description = 'Maaf, tidak ada data yang tersedia untuk ditampilkan.'
}: EmptyStateProps) {
  return (
    <Card className='flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center'>
      <CardContent className='flex flex-col items-center gap-4'>
        <AlertCircle className='h-12 w-12 text-gray-400' />
        <CardTitle className='text-lg font-semibold text-gray-700'>
          {title}
        </CardTitle>
        <CardDescription className='text-sm text-gray-500'>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
