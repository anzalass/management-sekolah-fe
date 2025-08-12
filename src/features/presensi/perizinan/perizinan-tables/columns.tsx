'use client';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { API } from '@/lib/server';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { useState } from 'react';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'nip',
    header: 'NIP',
    cell: ({ row }) => row.original.nip
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => row.original.keterangan || '-'
  },
  {
    accessorKey: 'time',
    header: 'Tanggal & Waktu',
    cell: ({ row }) => {
      const time = row.original.time;
      if (!time) return '-';

      const date = new Date(time);
      const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);

      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return (
        <div className='flex space-x-3 text-sm text-gray-800'>
          <span>{formattedDate}</span>
          <span className='flex items-center gap-1 text-gray-600'>
            <Clock className='h-4 w-4' />
            {formattedTime}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status || '';
      let bgColor = 'bg-gray-100 text-gray-600';
      if (status.toLowerCase() === 'disetujui') {
        bgColor = 'bg-green-100 text-green-800';
      } else if (status.toLowerCase() === 'ditolak') {
        bgColor = 'bg-red-100 text-red-800';
      } else if (status.toLowerCase() === 'menunggu') {
        bgColor = 'bg-yellow-100 text-yellow-800';
      }

      return (
        <span className={`rounded-md px-2 py-1 text-xs font-medium ${bgColor}`}>
          {status}
        </span>
      );
    }
  },
  {
    accessorKey: 'bukti',
    header: 'Bukti',
    cell: ({ row }) => {
      const bukti = row.original.bukti;
      if (!bukti) return '-';

      return (
        <a
          href={bukti}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-blue-600 underline'
        >
          Lihat Bukti
        </a>
      );
    }
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
      const { toggleTrigger } = useRenderTrigger(); // pindahkan ke sini
      const [loading, setLoading] = useState(false);
      const id = row.original.id;

      const handleApprove = async () => {
        setLoading(true);
        try {
          await axios.put(`${API}perizinan-guru/acc/${id}`);
          toggleTrigger();
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      const handleReject = async () => {
        setLoading(true);
        try {
          await axios.put(`${API}perizinan-guru/reject/${id}`);
          toggleTrigger();
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className='flex gap-2'>
          <button
            disabled={loading}
            onClick={handleApprove}
            className='rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-50'
          >
            Setujui
          </button>
          <button
            disabled={loading}
            onClick={handleReject}
            className='rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50'
          >
            Tolak
          </button>
        </div>
      );
    }
  }
];
