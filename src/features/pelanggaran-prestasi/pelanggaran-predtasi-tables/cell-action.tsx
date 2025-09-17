'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { API } from '@/lib/server';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { PelanggaranPrestasi } from './columns';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

interface CellActionProps {
  data: PelanggaranPrestasi;
}

export const PelanggaranPrestasiCellAction: React.FC<CellActionProps> = ({
  data
}) => {
  const [loading, setLoading] = useState(false);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;
  const onConfirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`pelanggaran-prestasi/${data.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setOpen(false);
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/pelanggaran-prestasi/${data.id}`)
            }
          >
            <Edit className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
