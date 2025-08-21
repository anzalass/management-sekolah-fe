'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { GuruTemplate } from '../guru-template-listing'; // Adjust the import path accordingly
import { API } from '@/lib/server';
import Image from 'next/image';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}view-image`; // API route to view images for GuruTemplate

export const columns: ColumnDef<GuruTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name // Display the name of the GuruTemplate
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
    cell: ({ row }) => <CellAction data={row.original} /> // Call the CellAction component for actions (Edit/Delete)
  }
];
