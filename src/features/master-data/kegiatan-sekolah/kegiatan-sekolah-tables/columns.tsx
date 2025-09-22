'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { KegiatanSekolah } from '../kegiatan-sekolah-listing';
import { Button } from '@/components/ui/button';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export const columns: ColumnDef<KegiatanSekolah>[] = [
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'tahunAjaran',
    header: 'Tahun Ajaran',
    cell: ({ row }) => row.original.tahunAjaran
  },
  {
    accessorKey: 'keterangan',
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => row.original.status
  },
  {
    id: 'statusActions',
    header: 'Ubah Status',
    cell: ({ row }) => {
      const { data: session } = useSession();
      const { toggleTrigger } = useRenderTrigger(); // pindahkan ke sini
      const [loading, setLoading] = useState(false);
      const id = row.original.id;

      const handleEditStatus = async (status: string) => {
        setLoading(true);
        try {
          await api.put(
            `kegiatan-sekolah/status/${id}`,
            {
              status: status
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
          toggleTrigger();
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Terjadi Kesalahan');
        } finally {
          setLoading(false);
        }
      };
      return (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleEditStatus('Selesai')}
          >
            Selesai
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleEditStatus('Sedang Berlangsung')}
          >
            Sedang Berlangsung
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleEditStatus('Belum Terlaksana')}
          >
            Belum Terlaksana
          </Button>
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
