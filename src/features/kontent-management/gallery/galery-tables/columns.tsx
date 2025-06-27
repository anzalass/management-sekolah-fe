'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Gallery } from '../galery-listing';

const BASE_URL = 'http://localhost:5000/api/v1/view-image';

export const columns: ColumnDef<Gallery>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      // Constructing the image URL
      const imageUrl = `${BASE_URL}/${row.original.image.split('/')[1]}`;
      return (
        <img
          src={imageUrl}
          alt='Gallery Image'
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
        />
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
