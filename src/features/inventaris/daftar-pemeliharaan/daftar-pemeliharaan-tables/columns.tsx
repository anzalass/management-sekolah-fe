'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type PemeliharaanInventaris = {
  id: string;
  nama: string;
  quantity: number;
  status: string;
  ruang: string;
  biaya: string;
  tanggal: Date;
  keterangan: string;
};

export const columns: ColumnDef<PemeliharaanInventaris>[] = [
  {
    accessorKey: 'nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'status', // NIP
    header: 'Status',
    cell: ({ row }) => row.original.status
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
    accessorKey: 'Biaya', // NIP
    header: 'biaya',
    cell: ({ row }) => row.original.biaya
  },
  {
    accessorKey: 'Keterangan', // NIP
    header: 'keterangan',
    cell: ({ row }) => row.original.keterangan
  },

  {
    accessorKey: 'tanggal', // NIP
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
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
