'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export type Tagihan = {
  id: string;
  nama: string;
  namaSiswa: string;
  nisSiswa: string;
  waktu: Date;
  jatuhTempo: Date;
  status: string;
  keterangan: string;
  nominal: number;
};

export const columns: ColumnDef<Tagihan>[] = [
  {
    accessorKey: 'nama',
    header: 'Nama Tagihan',
    cell: ({ row }) => row.original.nama
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
    accessorKey: 'nominal',
    header: 'Nominal',
    cell: ({ row }) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(row.original.nominal)
  },
  {
    accessorKey: 'waktu',
    header: 'Tanggal Dibuat',
    cell: ({ row }) => {
      const time = new Date(row.original.waktu);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(time);
    }
  },
  {
    accessorKey: 'jatuhTempo',
    header: 'Jatuh Tempo',
    cell: ({ row }) => {
      const time = new Date(row.original.jatuhTempo);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(time);
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => row.original.status
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan || '-'
  },

  {
    accessorKey: 'bayar',
    header: 'Bayar',
    cell: ({ row }) => {
      const { status, id } = row.original;

      const { toggleTrigger } = useRenderTrigger(); // pindahkan ke sini
      const { data: session } = useSession();

      const handleBayar = async (tipe: 'Cash' | 'Transfer') => {
        try {
          await api.post(
            `bayar-tagihan/${id}`,
            {
              metodeBayar: tipe
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
          toast.success(`Pembayaran ${tipe} berhasil!`);
          toggleTrigger();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        }
      };

      return (
        <div className='flex gap-2'>
          {status === 'BELUM_BAYAR' ? (
            <>
              <Button
                size='sm'
                className='bg-green-500 hover:bg-green-600'
                onClick={() => handleBayar('Cash')}
              >
                Cash
              </Button>
              <Button
                size='sm'
                className='bg-blue-500 hover:bg-blue-600'
                onClick={() => handleBayar('Transfer')}
              >
                Transfer
              </Button>
            </>
          ) : (
            <p>Sudah Bayar</p>
          )}
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
