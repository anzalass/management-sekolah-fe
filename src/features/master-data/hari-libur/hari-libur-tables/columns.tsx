'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { HariLibur } from '../hari-libur-listing';

export const columns: ColumnDef<HariLibur>[] = [
  {
    accessorKey: 'namaHari',
    header: 'Nama Hari',
    cell: ({ row }) => row.original.namaHari
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal',
    cell: ({ row }) => {
      const formatTanggal = (date?: any) => {
        const tanggal = date ? new Date(date) : null;
        if (!tanggal || isNaN(tanggal.getTime())) {
          return 'Tanggal tidak valid';
        }

        return new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).format(tanggal);
      };

      // Ambil data 'tanggal' dari baris
      const tanggal = row.getValue('tanggal');
      return formatTanggal(tanggal);
    }
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
