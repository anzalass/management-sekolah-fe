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
import { Product } from '@/constants/data';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { Tagihan } from './columns';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  data: Tagihan;
}

export const CellActionMengajar: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { trigger, toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();
  const onConfirm = async () => {
    try {
      await api.delete(`pembayaran/${data.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setOpen(false);
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
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
              router.push(`/mengajar/pembayaran/daftar-tagihan/${data.id}`)
            }
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
