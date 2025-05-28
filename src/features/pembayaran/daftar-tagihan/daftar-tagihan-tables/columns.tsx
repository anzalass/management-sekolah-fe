'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type Tagihan = {
  id: string;
  nama_tagihan: string;
  keterangan: string;
  nis: string;
  nama_siswa: string;
  total_tagihan: number;
  tanggal_bayar: Date;
};

export const columns: ColumnDef<Tagihan>[] = [
  {
    accessorKey: 'title', // NIP
    header: 'Judul',
    cell: ({ row }) => row.original.nama_tagihan
  },
  {
    accessorKey: 'keterangan', // NIP
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan
  },
  {
    accessorKey: 'nis', // NIP
    header: 'NIS',
    cell: ({ row }) => row.original.nis
  },
  {
    accessorKey: 'total_tagihan', // NIP
    header: 'Total Tagihan',
    cell: ({ row }) => row.original.total_tagihan
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
      return formatTanggal(row.original.tanggal_bayar);
    }
  },

  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
