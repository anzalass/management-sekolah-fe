'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PendaftaranCellAction } from './cell-action';
import { Pendaftaran } from '../pendaftaran-listing';
import { API } from '@/lib/server';

const BASE_URL = `${API}view-image`;

export const columns: ColumnDef<Pendaftaran>[] = [
  {
    accessorKey: 'studentName',
    header: 'Student Name',
    cell: ({ row }) => row.original.studentName
  },
  {
    accessorKey: 'parentName',
    header: 'Parent Name',
    cell: ({ row }) => row.original.parentName
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({ row }) => row.original.phoneNumber
  },
  {
    accessorKey: 'kategori',
    header: 'Kategori',
    cell: ({ row }) => row.original.kategori
  },
  {
    accessorKey: 'yourLocation',
    header: 'Location',
    cell: ({ row }) => row.original.yourLocation
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <PendaftaranCellAction data={row.original} /> // PendaftaranCellAction handles edit and delete actions
  }
];
