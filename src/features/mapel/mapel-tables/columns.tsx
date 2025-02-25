'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Mapel } from '../mapel-listing';

export const columns: ColumnDef<Mapel>[] = [
  {
    accessorKey: 'nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'kelas', // NIP
    header: 'Kelas',
    cell: ({ row }) => row.original.kelas
  },
  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
