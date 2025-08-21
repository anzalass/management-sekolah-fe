'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { toast } from 'sonner';

// type sesuai model Prisma
export type Peminjaman = {
  id: string;
  idSiswa: string;
  idBuku?: string | null;
  namaBuku: string;
  waktuPinjam: string; // ISO Date
  waktuKembali: string; // ISO Date
  status: 'dipinjam' | 'dikembalikan' | 'terlambat';
  keterangan?: string | null;
  Siswa?: {
    nama: string;
    nis: string;
  };
};

// Komponen khusus untuk actions biar bisa pakai hooks
function ActionCell({ id }: { id: string }) {
  const { toggleTrigger } = useRenderTrigger();

  const handleKembalikan = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}pengembalian/${id}`);
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal mengembalikan');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}peminjaman/${id}`);
      toggleTrigger();
    } catch (error) {
      toast.error('Gagal Menghapus');
    }
  };

  return (
    <div className='flex gap-2'>
      <Button variant='destructive' size='sm' onClick={handleDelete}>
        Hapus
      </Button>

      <Button variant='default' size='sm' onClick={handleKembalikan}>
        Kembalikan
      </Button>
    </div>
  );
}

export const columns: ColumnDef<Peminjaman>[] = [
  {
    accessorKey: 'Siswa.nama',
    header: 'Nama Siswa',
    cell: ({ row }) => row.original.Siswa?.nama || '-'
  },
  {
    accessorKey: 'Siswa.nis',
    header: 'NIS',
    cell: ({ row }) => row.original.Siswa?.nis || row.original.idSiswa
  },
  {
    accessorKey: 'namaBuku',
    header: 'Judul Buku',
    cell: ({ row }) => row.original.namaBuku
  },
  {
    accessorKey: 'waktuPinjam',
    header: 'Waktu Pinjam',
    cell: ({ row }) =>
      new Date(row.original.waktuPinjam).toLocaleDateString('id-ID')
  },
  {
    accessorKey: 'waktuKembali',
    header: 'Waktu Kembali',
    cell: ({ row }) =>
      new Date(row.original.waktuKembali).toLocaleDateString('id-ID')
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const colors: Record<string, string> = {
        dipinjam: 'text-blue-600',
        dikembalikan: 'text-green-600',
        terlambat: 'text-red-600'
      };
      return <span className={colors[status]}>{status}</span>;
    }
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => (
      <span className='line-clamp-2'>{row.original.keterangan || '-'}</span>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell id={row.original.id} />
  }
];
