'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { News } from '../news-listing';
import { API } from '@/lib/server';
import Image from 'next/image';

const BASE_URL = `view-image`;
// API route untuk melihat gambar

export const columns: ColumnDef<News>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => row.original.title
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => row.original.content
  },

  {
    accessorKey: 'image', // Foto
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl =
        row.original.image ||
        'https://ik.imagekit.io/o3afko3h0/default-image.jpg?updatedAt=1739253554742'; // Ganti dengan gambar default

      return (
        <div className='relative h-16 w-16'>
          <Image
            src={imageUrl}
            alt='Guru'
            layout='fill'
            objectFit='cover'
            className='rounded-md'
          />
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
