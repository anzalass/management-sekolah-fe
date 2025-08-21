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
import { Inventaris } from '../daftar-inventaris-form';
import ModalFormMaintenance from '../modal-form-maintenence';
import { toast } from 'sonner';

interface CellActionProps {
  data: Inventaris;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [inventaris, setInventaris] = useState<Inventaris | null>(null); // State untuk menyimpan data inventaris
  const router = useRouter();
  const { toggleTrigger } = useRenderTrigger();

  const onDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}inventaris/delete/${data.id}`
      );
      setOpenDelete(false);
      toggleTrigger();
    } catch (error) {}
  };

  // Fetch data ketika modal maintenance dibuka
  useEffect(() => {
    if (openMaintenance) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}inventaris/get/${data.id}`
          );
          setInventaris(response.data.data);
        } catch (error) {
          toast.error('Error fetching data');
        }
      };
      fetchData();
    }
  }, [openMaintenance, data.id]);

  return (
    <>
      {/* Modal Delete */}
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDeleteConfirm}
        loading={loading}
      />

      {/* Modal Maintenance */}
      {openMaintenance && inventaris && (
        <ModalFormMaintenance
          open={openMaintenance}
          setOpen={setOpenMaintenance}
          inventaris={inventaris}
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

          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/inventaris/daftar-inventaris/${data.id}`)
            }
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenMaintenance(true)}>
            <Wrench className='mr-2 h-4 w-4' /> Maintenance
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
