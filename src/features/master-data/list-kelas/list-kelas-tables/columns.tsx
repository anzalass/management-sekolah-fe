'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { ListKelas } from '../list-kelas-form';

export const columns: ColumnDef<ListKelas>[] = [
  {
    accessorKey: 'namaKelas', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.namaKelas
  },
  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
