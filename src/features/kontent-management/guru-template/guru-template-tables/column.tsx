'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { GuruTemplate } from '../guru-template-listing'; // Adjust the import path accordingly
import { API } from '@/lib/server';

const BASE_URL = `${API}view-image`; // API route to view images for GuruTemplate

export const columns: ColumnDef<GuruTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name // Display the name of the GuruTemplate
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      // Assuming 'image' contains the file path for the image
      const imageUrl = `${BASE_URL}/${row.original.image.split('/')[1]}`;
      return (
        <img src={imageUrl} alt='Guru Template Image' width={50} height={50} />
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} /> // Call the CellAction component for actions (Edit/Delete)
  }
];
