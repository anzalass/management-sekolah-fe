'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { Pendaftaran } from '../pendaftaran-form';

export const columns: ColumnDef<Pendaftaran>[] = [
  {
    accessorKey: 'studentName', // NIP
    header: 'Nama Calon Peserta Didik',
    cell: ({ row }) => row.original.studentName
  },
  {
    accessorKey: 'parentName', // Nama
    header: 'Nama Orang Tua ',
    cell: ({ row }) => row.original.parentName
  },
  {
    accessorKey: 'email', // Jabatan
    header: 'Email',
    cell: ({ row }) => row.original.email
  },

  {
    accessorKey: 'phoneNumber', // No Telepon
    header: 'No Telepon',
    cell: ({ row }) => row.original.phoneNumber
  },
  {
    accessorKey: 'yourLocation', // No Telepon
    header: 'Alamat',
    cell: ({ row }) => row.original.yourLocation
  },
  {
    accessorKey: 'email', // Email
    header: 'Email',
    cell: ({ row }) => row.original.email
  },

  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
