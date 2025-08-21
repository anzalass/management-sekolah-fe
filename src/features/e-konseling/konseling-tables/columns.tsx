'use client';

import { ColumnDef } from '@tanstack/react-table';
import { KonselingCellAction } from './cell-action';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export type Konseling = {
  id: string;
  idSiswa: string;
  namaSiswa: string;
  tanggal: string;
  keterangan: string;
};

export const columns: ColumnDef<Konseling>[] = [
  {
    accessorKey: 'namaSiswa',
    header: 'Nama Siswa',
    cell: ({ row }) => row.original.namaSiswa
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.original.tanggal);
      return format(date, 'dd MMMM yyyy', { locale: localeID });
    }
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <KonselingCellAction data={row.original} />
  }
];
