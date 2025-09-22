'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Gallery } from '../galery-listing';
import { API } from '@/lib/server';
import Image from 'next/image';

const BASE_URL = `view-image`;

export const columns: ColumnDef<Gallery>[] = [
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
