'use client';
import { ColumnDef } from '@tanstack/react-table';

type Kehadiran = {
  nis: string;
  nama: string;
  kehadiranSiswa: DetailKehadiran[];
};

type DetailKehadiran = {
  id: string;
  nisSiswa: string;
  idKelas: string;
  waktu: string;
  keterangan: string;
};

export const columnss: ColumnDef<Kehadiran>[] = [
  {
    id: 'no', // kolom tanpa accessorKey, pakai id sendiri
    header: 'No',
    cell: ({ row }) => row.index + 1, // row.index dimulai dari 0
    size: 50 // optional, atur lebar kolom
  },
  {
    accessorKey: 'nis',
    header: 'nis',
    cell: ({ row }) => row.original.nis
  },
  {
    accessorKey: 'nama',
    header: 'nama',
    cell: ({ row }) => {
      console.log('Row data:', row.original); // Ini bakal nge-log data baris lengkap
      return row.original?.nama;
    }
  }
  // {
  //   header: 'Keterangan',
  //   accessorFn: (row) => row.kehadiranSiswa?.[0]?.keterangan ?? 'kosong',
  //   cell: ({ getValue }) => getValue() as string
  // },
  // {
  //   header: 'Waktu',
  //   accessorFn: (row) => row.kehadiranSiswa?.[0]?.waktu ?? 'kosong',
  //   cell: ({ getValue }) => {
  //     const rawDate = getValue() as string;
  //     if (rawDate === '-') return '-';
  //     const date = new Date(rawDate);
  //     if (isNaN(date.getTime())) return 'Tanggal tidak valid';

  //     return new Intl.DateTimeFormat('id-ID', {
  //       day: '2-digit',
  //       month: 'long',
  //       year: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit'
  //     }).format(date);
  //   }
  // }
];
