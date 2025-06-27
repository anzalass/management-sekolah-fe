'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { News } from '../news-listing';

const BASE_URL = 'http://localhost:5000/api/v1/view-image'; // API route untuk melihat gambar

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
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      // Menggunakan split untuk memisahkan 'uploads/' dan nama file
      const imageUrl = `${BASE_URL}/${row.original.image.split('/')[1]}`;
      return <img src={imageUrl} alt='News Image' width={50} height={50} />;
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
