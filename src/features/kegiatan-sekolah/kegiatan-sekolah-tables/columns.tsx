'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { KegiatanSekolah } from '../kegiatan-sekolah-listing';

export const columns: ColumnDef<KegiatanSekolah>[] = [
  {
    accessorKey: 'nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'tahunAjaran', // NIP
    header: 'Tahun Ajaran',
    cell: ({ row }) => row.original.tahunAjaran
  },
  {
    accessorKey: 'keterangan', // Nama
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan
  },
  {
    accessorKey: 'waktuMulai',
    header: 'Waktu Mulai',
    cell: ({ row }) => {
      const date = new Date(row.original.waktuMulai);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  },
  {
    accessorKey: 'waktuSelesai',
    header: 'Waktu Selesai',
    cell: ({ row }) => {
      const date = new Date(row.original.waktuSelesai);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  },
  {
    accessorKey: 'status', // Jenis Kelamin
    header: 'Status',
    cell: ({ row }) => row.original.status
  },

  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
