'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PelanggaranPrestasiCellAction } from './cell-action';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export type PelanggaranPrestasi = {
  id: string;
  idSiswa: string;
  waktu: string;
  poin: number;
  jenis: string;
  keterangan: string;
  Siswa: any;
};

export const columns: ColumnDef<PelanggaranPrestasi>[] = [
  {
    accessorKey: 'Siswa',
    header: 'Nama Siswa',
    cell: ({ row }) => row.original.Siswa.nama
  },
  {
    accessorKey: 'waktu',
    header: 'Waktu',
    cell: ({ row }) => {
      const date = new Date(row.original.waktu);
      return format(date, 'dd MMMM yyyy HH:mm', { locale: localeID });
    }
  },
  {
    accessorKey: 'poin',
    header: 'Poin',
    cell: ({ row }) => row.original.poin
  },
  {
    accessorKey: 'jenis',
    header: 'Jenis',
    cell: ({ row }) => row.original.jenis
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <PelanggaranPrestasiCellAction data={row.original} />
  }
];
