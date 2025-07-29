'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Testimonial } from '../testimoni-listing';
import { API } from '@/lib/server';

const BASE_URL = `${API}view-image`;

export const columns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: 'parentName',
    header: 'Nama Orang Tua',
    cell: ({ row }) => row.original.parentName
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => row.original.description
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = `${BASE_URL}/${row.original.image.split('/')[1]}`;
      return (
        <img src={imageUrl} alt='Testimonial Image' width={50} height={50} />
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
