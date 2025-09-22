'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Anggaran } from '../anggaran-form';

export const columns: ColumnDef<Anggaran>[] = [
  {
    accessorKey: 'nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },

  {
    accessorKey: 'jumlah', // NIP
    header: 'Jumlah',
    cell: ({ row }) => {
      const value = row.original.jumlah;
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    }
  },

  {
    accessorKey: 'jenis', // NIP
    header: 'Jenis',
    cell: ({ row }) => row.original.jenis
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
