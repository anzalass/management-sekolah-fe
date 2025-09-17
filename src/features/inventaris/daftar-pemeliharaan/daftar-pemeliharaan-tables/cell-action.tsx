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
import { Edit, MoreHorizontal, Trash, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { PemeliharaanInventaris } from './columns';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  data: PemeliharaanInventaris;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [inventaris, setInventaris] = useState<PemeliharaanInventaris | null>(
    null
  ); // State untuk menyimpan data inventaris
  const router = useRouter();
  const { toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  const onDeleteConfirm = async () => {
    try {
      await api.delete(`inventaris/delete/${data.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      setOpenDelete(false);
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const selesaiMaintenence = async () => {
    try {
      await api.put(
        `/pemeliharaan-inventaris/update-status/${data.id}`,
        {
          status: 'Selesai Di Maintenence'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      setOpenMaintenance(false);
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <>
      {/* Modal Delete */}
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDeleteConfirm}
        loading={loading}
      />
      {data.status === 'Non Aktif' ? null : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={selesaiMaintenence}>
              <Wrench className='mr-2 h-4 w-4' />
              Selesai Maintenance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
