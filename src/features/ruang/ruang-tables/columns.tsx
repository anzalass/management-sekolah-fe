'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Ruangan } from '../ruang-listing';

export const columns: ColumnDef<Ruangan>[] = [
  {
    accessorKey: 'nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'keterangan', // NIP
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan
  },
  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
