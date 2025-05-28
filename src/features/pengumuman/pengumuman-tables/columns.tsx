'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Pengumuman } from '../pengumuman-form';

export const columns: ColumnDef<Pengumuman>[] = [
  {
    accessorKey: 'title', // NIP
    header: 'Judul',
    cell: ({ row }) => row.original.title
  },
  {
    accessorKey: 'time',
    header: 'Tanggal',
    cell: ({ row }) => {
      const formatTanggal = (date?: string | Date) => {
        const time = date ? new Date(date) : null;
        if (!time || isNaN(time.getTime())) {
          return 'Tanggal tidak valid';
        }

        return new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).format(time);
      };

      // Ambil data 'tanggal' dari baris
      const tanggal = row.getValue('time');
      return formatTanggal(row.original.time);
    }
  },

  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
