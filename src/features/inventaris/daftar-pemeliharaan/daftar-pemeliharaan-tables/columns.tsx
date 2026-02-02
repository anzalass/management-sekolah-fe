'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type PemeliharaanInventaris = {
  id: string;
  status: string;
  quantity: number;
  ruang: string;
  biaya?: number;
  tanggal: Date;
  keterangan: string;
  Inventaris: {
    nama: string;
  };
};

export const columns: ColumnDef<PemeliharaanInventaris>[] = [
  {
    accessorKey: 'Inventaris.nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.Inventaris.nama
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      // Fungsi untuk menentukan warna background & teks
      const getBadgeStyle = (status: any) => {
        switch (status) {
          case 'Sedang Maintenance':
            return { backgroundColor: '#ffeaa7', color: '#2d3436' }; // Kuning lembut
          case 'Selesai Maintenance':
            return { backgroundColor: '#00b894', color: '#fff' }; // Hijau
          case 'Diberikan':
            return { backgroundColor: '#74b9ff', color: '#fff' }; // Biru
          case 'Digunakan':
            return { backgroundColor: '#0984e3', color: '#fff' }; // Biru tua
          case 'Rusak':
            return { backgroundColor: '#d63031', color: '#fff' }; // Merah
          default:
            return { backgroundColor: '#dfe6e9', color: '#2d3436' }; // Abu-abu default
        }
      };

      return (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: '500',
            ...getBadgeStyle(status)
          }}
        >
          {status}
        </span>
      );
    }
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
