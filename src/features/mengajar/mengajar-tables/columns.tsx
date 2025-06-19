'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { KelasdanMapel } from '../mengajar-form';

export const columns: ColumnDef<KelasdanMapel>[] = [
  {
    accessorKey: 'namaMapel', // NIP
    header: 'Nama Mapel',
    cell: ({ row }) => row.original.namaMapel
  },
  {
    accessorKey: 'ruangKelas', // NIP
    header: 'Ruang Kelas',
    cell: ({ row }) => row.original.ruangKelas
  },
  {
    accessorKey: 'waktuMengajar', // NIP
    header: 'Waktu Mengajar',
    cell: ({ row }) => row.original.waktuMengajar
  },
  {
    accessorKey: 'kelas', // NIP
    header: 'Waktu Mengajar',
    cell: ({ row }) => row.original.kelas
  },
  {
    accessorKey: 'tahunAjaran', // NIP
    header: 'Waktu Mengajar',
    cell: ({ row }) => row.original.tahunAjaran
  },
  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
