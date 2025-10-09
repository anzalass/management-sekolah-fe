'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

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
  buktiUrl?: string | null;
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'BELUM_BAYAR':
      return {
        text: 'Belum Bayar',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
        borderColor: 'border-red-500'
      };
    case 'PENDING':
      return {
        text: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
        borderColor: 'border-yellow-500'
      };
    case 'LUNAS':
      return {
        text: 'Lunas',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        borderColor: 'border-green-500'
      };
    case 'MENUNGGU_KONFIRMASI':
      return {
        text: 'Menunggu Konfirmasi',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
        borderColor: 'border-yellow-500'
      };
    case 'BUKTI_TIDAK_VALID':
      return {
        text: 'Bukti Tidak Valid',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
        borderColor: 'border-red-500'
      };
    default:
      return {
        text: status,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        borderColor: 'border-gray-500'
      };
  }
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

  // ✅ Kolom status dengan warna
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { text, bgColor, textColor, borderColor } = getStatusConfig(
        row.original.status
      );
      return (
        <span
          className={`inline-block rounded-lg border ${borderColor} ${bgColor} ${textColor} px-3 py-1 text-sm font-medium`}
        >
          {text}
        </span>
      );
    }
  },

  // ✅ Kolom bukti pembayaran pakai modal
  {
    accessorKey: 'buktiPembayaran',
    header: 'Bukti Pembayaran',
    cell: ({ row }) => {
      const bukti = row.original.buktiUrl;
      const { id } = row.original;

      const [open, setOpen] = useState(false);
      const { data: session } = useSession();
      const { toggleTrigger } = useRenderTrigger();

      const handleKonfirmasi = async () => {
        try {
          await api.post(
            `bayar-tagihan/${id}`,
            { metodeBayar: 'Transfer' },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
          toast.success(`Pembayaran trasnsfer berhasil!`);
          setOpen(false);
          toggleTrigger();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        }
      };

      const handleKonfirmasiTidakValid = async () => {
        try {
          await api.patch(`pembayaran-bukti-tidak-valid/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
          toast.success(`Bukti tidak valid!`);
          setOpen(false);
          toggleTrigger();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        }
      };

      if (!bukti)
        return <span className='italic text-gray-400'>Belum diupload</span>;

      return (
        <>
          <button
            onClick={() => setOpen(true)}
            className='text-blue-600 underline hover:text-blue-800'
          >
            Lihat Bukti
          </button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='sm:max-w-lg'>
              <DialogHeader>
                <DialogTitle>Bukti Pembayaran</DialogTitle>
              </DialogHeader>

              <div className='mt-2 flex flex-col items-center space-y-4'>
                <img
                  src={bukti}
                  alt='Bukti Pembayaran'
                  className='max-h-[400px] w-auto rounded-lg border object-contain'
                />

                <div className='flex w-full justify-between gap-4'>
                  <Button
                    onClick={handleKonfirmasi}
                    className='w-1/2 bg-green-600 text-white hover:bg-green-700'
                  >
                    Transfer Berhasil
                  </Button>
                  <Button
                    onClick={handleKonfirmasiTidakValid}
                    className='w-1/2 bg-red-600 text-white hover:bg-red-700'
                  >
                    Bukti Tidak Valid
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    }
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
      const { toggleTrigger } = useRenderTrigger();
      const { data: session } = useSession();

      const handleBayar = async (tipe: 'Cash' | 'Transfer') => {
        try {
          await api.post(
            `bayar-tagihan/${id}`,
            { metodeBayar: tipe },
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
            <p className='text-sm italic text-gray-500'>Sudah Bayar</p>
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
