'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type RiwayatPembayaran = {
  id: string;
  namaSiswa: string;
  nisSiswa: string;
  idSiswa?: string;
  idTagihan: string;
  waktuBayar: Date;
  metodeBayar: string;
  status: string;
  Tagihan?: {
    id: string;
    nama: string;
  };
};

export const columns: ColumnDef<RiwayatPembayaran>[] = [
  {
    accessorKey: 'Tagihan.nama',
    header: 'Nama Tagihan',
    cell: ({ row }) => row.original.Tagihan?.nama || '-'
  },
  {
    accessorKey: 'nisSiswa',
    header: 'NIS',
    cell: ({ row }) => row.original.nisSiswa
  },
  {
    accessorKey: 'namaSiswa',
    header: 'Nama Siswa',
    cell: ({ row }) => row.original.namaSiswa
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => row.original.status
  },
  {
    accessorKey: 'metodeBayar',
    header: 'Metode Bayar',
    cell: ({ row }) => row.original.metodeBayar
  },
  {
    accessorKey: 'waktuBayar',
    header: 'Tanggal Bayar',
    cell: ({ row }) => {
      const time = new Date(row.original.waktuBayar);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(time);
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
