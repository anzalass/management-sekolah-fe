'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Clock } from 'lucide-react';

export type KehadiranGuru = {
  id: string;
  idGuru: string;
  tanggal: string;
  jamMasuk?: string;
  jamPulang?: string;
  fotoMasuk?: string;
  lokasiMasuk?: string;
  lokasiPulang?: string;
  status: string;
  nama: string;
  nip: string;
};

export const columns: ColumnDef<KehadiranGuru>[] = [
  {
    accessorKey: 'nama',
    header: 'Nama'
  },
  {
    accessorKey: 'nip',
    header: 'NIP'
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal',
    cell: ({ row }) => {
      console.log('roww', row.original.tanggal);

      const date = new Date(row.original.tanggal);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  },
  {
    accessorKey: 'jamMasuk',
    header: 'Masuk',
    cell: ({ row }) => {
      if (!row.original.jamMasuk) return '-';
      const date = new Date(row.original.jamMasuk);
      const time = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return (
        <div className='flex items-center gap-2 text-sm text-gray-800'>
          <Clock className='h-4 w-4 text-gray-500' />
          {time}
        </div>
      );
    }
  },
  {
    accessorKey: 'jamPulang',
    header: 'Pulang',
    cell: ({ row }) => {
      if (!row.original.jamPulang) return '-';
      const date = new Date(row.original.jamPulang);
      const time = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return (
        <div className='flex items-center gap-2 text-sm text-gray-800'>
          <Clock className='h-4 w-4 text-gray-500' />
          {time}
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const isHadir = status.toLowerCase() === 'hadir';
      return (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            isHadir
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {status}
        </span>
      );
    }
  }
];
