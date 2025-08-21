'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BukuCellAction } from './cell-action';

export type Buku = {
  id: string;
  nama: string;
  filepdf?: string | null;
  pengarang: string;
  penerbit: string;
  tahunTerbit: number;
  keterangan: string;
  stok: number;
};

export const columns: ColumnDef<Buku>[] = [
  {
    accessorKey: 'nama',
    header: 'Judul Buku',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'pengarang',
    header: 'Pengarang',
    cell: ({ row }) => row.original.pengarang
  },
  {
    accessorKey: 'penerbit',
    header: 'Penerbit',
    cell: ({ row }) => row.original.penerbit
  },
  {
    accessorKey: 'tahunTerbit',
    header: 'Tahun Terbit',
    cell: ({ row }) => row.original.tahunTerbit
  },
  {
    accessorKey: 'stok',
    header: 'Stok',
    cell: ({ row }) => row.original.stok
  },
  {
    accessorKey: 'filepdf',
    header: 'File PDF',
    cell: ({ row }) =>
      row.original.filepdf ? (
        <a
          href={row.original.filepdf}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline'
        >
          Lihat PDF
        </a>
      ) : (
        <span className='text-gray-400'>-</span>
      )
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => (
      <span className='line-clamp-2'>{row.original.keterangan}</span>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <BukuCellAction data={row.original} />
  }
];
