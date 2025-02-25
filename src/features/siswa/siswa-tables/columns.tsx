'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { Siswa } from '../siswa-listing';

export const columns: ColumnDef<Siswa>[] = [
  {
    accessorKey: 'nis', // NIP
    header: 'NIS',
    cell: ({ row }) => row.original.nis
  },
  {
    accessorKey: 'nama', // Nama
    header: 'Nama',
    cell: ({ row }) => row.original.nama
  },
  {
    accessorKey: 'kelas', // Jabatan
    header: 'Kelas',
    cell: ({ row }) => row.original.kelas
  },
  {
    accessorKey: 'agama', // Agama
    header: 'Agama',
    cell: ({ row }) => row.original.agama
  },
  {
    accessorKey: 'jenisKelamin', // Jenis Kelamin
    header: 'Jenis Kelamin',
    cell: ({ row }) => row.original.jenisKelamin
  },
  {
    accessorKey: 'noTelepon', // No Telepon
    header: 'No Telepon',
    cell: ({ row }) => row.original.noTelepon
  },
  {
    accessorKey: 'email', // Email
    header: 'Email',
    cell: ({ row }) => row.original.email
  },

  {
    accessorKey: 'foto', // Foto
    header: 'Foto',
    cell: ({ row }) => {
      const imageUrl =
        row.original.foto ||
        'https://ik.imagekit.io/o3afko3h0/default-image.jpg?updatedAt=1739253554742'; // Ganti dengan gambar default

      return (
        <div className='relative h-16 w-16'>
          <Image
            src={imageUrl}
            alt='Guru'
            layout='fill'
            objectFit='cover'
            className='rounded-md'
          />
        </div>
      );
    }
  },
  {
    id: 'actions', // Actions (untuk tombol aksi seperti edit, delete)
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
