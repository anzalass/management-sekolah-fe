'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Inventaris } from '../daftar-inventaris-form';
import ModalFormMaintenance2 from '../modal-form-maintenence-2';
import { useState } from 'react';

export const columns: ColumnDef<Inventaris>[] = [
  {
    accessorKey: 'nama', // NIP
    header: 'Nama',
    cell: ({ row }) => row.original.nama
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
    accessorKey: 'hargaBeli', // NIP
    header: 'Harga Beli',
    cell: ({ row }) => {
      const value = row.original.hargaBeli;
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    }
  },

  {
    accessorKey: 'waktuPengadaan', // NIP
    header: 'Waktu Pengadaan',
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
      const tanggal = row.getValue('waktuPengadaan');
      return formatTanggal(tanggal);
    }
  },

  {
    id: 'kelolaInventaris',
    header: 'Kelola Inventaris',
    cell: ({ row }) => {
      const [openModal, setOpenModal] = useState(false);
      const [modalStatus, setModalStatus] = useState<
        'Sedang Maintenance' | 'Diberikan' | 'Digunakan'
      >('Sedang Maintenance');

      const inventaris = row.original;

      const openMaintenance = () => {
        setModalStatus('Sedang Maintenance');
        setOpenModal(true);
      };

      const openBerikan = () => {
        setModalStatus('Diberikan');
        setOpenModal(true);
      };

      const openGunakan = () => {
        setModalStatus('Digunakan');
        setOpenModal(true);
      };

      const openRusak = () => {
        setModalStatus('Digunakan');
        setOpenModal(true);
      };

      // Opsional: hapus (bisa pakai CellAction atau fungsi terpisah)

      return (
        <>
          <div className='flex flex-wrap gap-2'>
            {/* Maintenance */}
            <button
              onClick={openMaintenance}
              className='rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700'
            >
              Maintenance
            </button>

            {/* Berikan */}
            <button
              onClick={openBerikan}
              className='rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-green-700'
            >
              Berikan
            </button>

            {/* Gunakan */}
            <button
              onClick={openGunakan}
              className='rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-amber-600'
            >
              Gunakan
            </button>

            {/* Hapus */}
            <button
              onClick={handleHapus}
              className='rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-700'
            >
              Hapus
            </button>
          </div>

          {/* Modal: hanya 1 instance per cell (efisien) */}
          <ModalFormMaintenance2
            inventaris={inventaris}
            open={openModal}
            setOpen={setOpenModal}
            status={modalStatus} // ✅ "Maintenance", "Berikan", atau "Gunakan"
            isEdit={false}
          />
        </>
      );
    }
  },
  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
