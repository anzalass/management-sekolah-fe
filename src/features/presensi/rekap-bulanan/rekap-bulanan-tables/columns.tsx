'use client';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import api from '@/lib/api';
import { API } from '@/lib/server';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

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
    accessorKey: 'totalHadirHariNormal',
    header: 'Total Hadir Normal',
    cell: ({ row }) => row.original.totalHadirHariNormal || '-'
  },
  {
    accessorKey: 'totalHadirHariLembur',
    header: 'Total Hadir Lembur',
    cell: ({ row }) => row.original.totalHadirHariLembur || '-'
  },
  {
    accessorKey: 'totalIzin',
    header: 'Total Izin',
    cell: ({ row }) => row.original.totalIzin || '-'
  },
  {
    accessorKey: 'totalAlpha',
    header: 'Total Alpha',
    cell: ({ row }) => row.original.totalAlpha || '-'
  },
  {
    accessorKey: 'seluruhTotalHadir',
    header: 'Total Hadir',
    cell: ({ row }) => row.original.seluruhTotalHadir || '-'
  }
];
