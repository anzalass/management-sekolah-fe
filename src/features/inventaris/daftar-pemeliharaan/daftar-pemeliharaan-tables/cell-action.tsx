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
import {
  Delete,
  Edit,
  MoreHorizontal,
  Pencil,
  Trash,
  Wrench
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@/lib/server';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { PemeliharaanInventaris } from './columns';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import ModalFormMaintenance from '../../inventaris-masuk/modal-form-maintenence';

interface CellActionProps {
  data: PemeliharaanInventaris;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [inventaris, setInventaris] = useState<PemeliharaanInventaris>(); // State untuk menyimpan data inventaris
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

  const selesaiMaintenence = async (status: any) => {
    try {
      await api.put(
        `/pemeliharaan-inventaris/update-status/${data.id}`,
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
      setOpenMaintenance(false);
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  useEffect(() => {
    if (openMaintenance) {
      const fetchData = async () => {
        try {
          const response = await api.get(
            `pemeliharaan-inventaris/get/${data.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
          setInventaris(response.data.data);
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Terjadi kesalahan');
        }
      };
      fetchData();
    }
  }, [openMaintenance, data.id]);

  const deleteHistory = async () => {
    try {
      await api.delete(`pemeliharaan-inventaris/delete/${data.id}`);
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
      {openMaintenance && inventaris && (
        <ModalFormMaintenance
          open={openMaintenance}
          setOpen={setOpenMaintenance}
          inventaris={inventaris}
          isEdit={true}
        />
      )}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {data.status === 'Sedang Maintenance' && (
            <>
              <DropdownMenuItem
                onClick={() => selesaiMaintenence('Selesai Maintenance')}
              >
                <Wrench className='mr-2 h-4 w-4' />
                Selesai Maintenance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenMaintenance(true)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              {data?.status !== 'Selesai Maintenance' && (
                <DropdownMenuItem onClick={deleteHistory}>
                  <Trash className='mr-2 h-4 w-4' />
                  Hapus
                </DropdownMenuItem>
              )}
            </>
          )}

          {data.status === 'Digunakan' && (
            <>
              <DropdownMenuItem
                onClick={() => selesaiMaintenence('Sudah Dikembalikan')}
              >
                <Wrench className='mr-2 h-4 w-4' />
                Kembalikan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenMaintenance(true)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              {data.status !== 'Sudah Dikembalikan' && (
                <DropdownMenuItem onClick={deleteHistory}>
                  <Trash className='mr-2 h-4 w-4' />
                  Hapus
                </DropdownMenuItem>
              )}
            </>
          )}

          {data.status === 'Rusak' && (
            <>
              <DropdownMenuItem onClick={() => setOpenMaintenance(true)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteHistory}>
                <Trash className='mr-2 h-4 w-4' />
                Hapus
              </DropdownMenuItem>
            </>
          )}

          {data.status === 'Diberikan' && (
            <>
              <DropdownMenuItem onClick={() => setOpenMaintenance(true)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteHistory}>
                <Trash className='mr-2 h-4 w-4' />
                Hapus
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
