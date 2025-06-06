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
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { GuruTemplate } from '../guru-template-listing';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { API } from '@/lib/server';

interface CellActionProps {
  data: GuruTemplate;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { trigger, toggleTrigger } = useRenderTrigger();
  const router = useRouter();

  // Handle the confirmation of the delete action
  const onConfirm = async () => {
    setLoading(true);
    try {
      // Make the API call to delete the GuruTemplate by id
      await axios.delete(`${API}guru-template/${data.id}`);
      setOpen(false);
      toggleTrigger();
      window.location.reload(); // Reload the page after deletion
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* AlertModal for confirmation on delete */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      {/* Dropdown menu for actions */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Edit action - navigate to the update page */}
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/master-data/guru-template/${data.id}`)
            }
          >
            <Edit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>

          {/* Delete action - confirm deletion */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
