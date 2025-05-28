'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Inventaris } from '../daftar-inventaris-form';

export const columns: ColumnDef<Inventaris>[] = [
  {
    accessorKey: 'nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },

  {
    accessorKey: 'quantity', // NIP
    header: 'Quantity',
    cell: ({ row }) => row.original.quantity
  },
  {
    accessorKey: 'ruang', // NIP
    header: 'Ruang',
    cell: ({ row }) => row.original.ruang
  },
  {
    accessorKey: 'hargaBeli', // NIP
    header: 'Harga Beli',
    cell: ({ row }) => row.original.hargaBeli
  },

  {
    accessorKey: 'waktuPengadaan', // NIP
    header: 'Waktu Pengadaan',
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
      const tanggal = row.getValue('waktuPengadaan');
      return formatTanggal(tanggal);
    }
  },
  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
