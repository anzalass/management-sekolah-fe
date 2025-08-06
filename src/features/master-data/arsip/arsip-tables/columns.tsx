'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Arsip } from '../arsip-listing';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const columns: ColumnDef<Arsip>[] = [
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => row.original.namaBerkas
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan
  },
  {
    accessorKey: 'url',
    header: 'File',
    cell: ({ row }) => {
      const fileUrl = row.original.url;
      return (
        <Link href={fileUrl} target='_blank' rel='noopener noreferrer'>
          <FileText className='h-5 w-5 text-blue-600 transition-transform hover:scale-110' />
        </Link>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
