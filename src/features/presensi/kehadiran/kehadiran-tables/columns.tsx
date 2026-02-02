'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Clock } from 'lucide-react';
import { KehadiranGuru } from '../kehadiran-guru-listing';
import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export const columns: ColumnDef<KehadiranGuru>[] = [
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
    accessorKey: 'tanggal',
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

      const tanggal = row.getValue('tanggal');
      return formatTanggal(tanggal);
    }
  },

  {
    accessorKey: 'fotoMasuk',
    header: 'Foto Masuk',
    cell: ({ row }) => {
      const foto = row.original.fotoMasuk;
      const [open, setOpen] = useState(false);

      if (!foto) return '-';

      return (
        <>
          {/* Thumbnail */}
          <Image
            src={foto}
            alt='Foto Masuk'
            width={40}
            height={40}
            className='cursor-pointer rounded object-cover'
            onClick={() => setOpen(true)}
          />

          {/* Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='max-w-sm'>
              <DialogHeader>
                <DialogTitle>Foto Absen Masuk</DialogTitle>
              </DialogHeader>

              <Image
                src={foto}
                alt='Foto Masuk'
                width={400}
                height={400}
                className='w-full rounded-lg object-cover'
                unoptimized
              />
            </DialogContent>
          </Dialog>
        </>
      );
    }
  },

  {
    accessorKey: 'jamMasuk',
    header: 'Masuk',
    cell: ({ row }) => {
      const jamMasuk = row.original.jamMasuk;
      if (!jamMasuk) return '-';

      const date = new Date(jamMasuk);
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return (
        <div className='flex items-center gap-2 text-sm text-gray-800'>
          <Clock className='h-4 w-4 text-gray-500' />
          {formattedTime}
        </div>
      );
    }
  },
  {
    accessorKey: 'jamPulang',
    header: 'Pulang',
    cell: ({ row }) => {
      const jamPulang = row.original.jamPulang;
      if (!jamPulang) return '-';

      const date = new Date(jamPulang);
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return (
        <div className='flex items-center gap-2 text-sm text-gray-800'>
          <Clock className='h-4 w-4 text-gray-500' />
          {formattedTime}
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
