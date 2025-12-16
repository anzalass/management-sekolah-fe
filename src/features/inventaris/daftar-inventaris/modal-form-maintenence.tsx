'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import { Inventaris } from './daftar-inventaris-form';
import { id } from 'date-fns/locale';

export default function ModalFormMaintenance({
  inventaris,
  open,
  setOpen,
  isEdit
}: {
  inventaris?: Inventaris | null; // ⬅️ tambahkan `?` atau `| null`
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const { toggleTrigger } = useRenderTrigger();
  const { data: session } = useSession();

  const [inv, setInv] = useState<any>(null);

  const getInv = async () => {
    try {
      const res = await api.get(
        `inventaris/get/${isEdit ? inventaris?.idinventaris : inventaris?.id} `
      );
      setInv(res.data.data.quantity);
      console.log('invvvv', res.data.data.quantity);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInv();
  }, [inventaris]);

  const form = useForm({
    defaultValues: {
      id: inventaris?.id,
      idinventaris: isEdit
        ? inventaris?.idinventaris || ''
        : inventaris?.id || '',
      nama: inventaris?.nama || '',
      quantity: '',
      hargaMaintenance: '',
      keterangan: '',
      status: inventaris?.status || ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log(data);

      if (!isEdit) {
        await api.post(`pemeliharaan-inventaris/create`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
      } else {
        await api.put(
          `pemeliharaan-inventaris/update/${inventaris?.id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
      }
      toast.success('Data berhasil disimpan');
      setLoading(false);
      setOpen(false);
      toggleTrigger();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
      setLoading(false);
    }
  };

  const selectedStatus = form.watch('status');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <DialogTitle className='dark:text-white'>
          Form Aksi Inventaris
        </DialogTitle>
        <DialogTrigger asChild></DialogTrigger>
      </VisuallyHidden>

      <DialogContent className='dark:text-white'>
        <DialogHeader>Aksi Inventaris - {inventaris?.nama}</DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Quantity */}
            <FormField
              control={form.control}
              name='quantity'
              rules={{
                required: 'Quantity wajib diisi',
                min: { value: 1, message: 'Quantity minimal 1' },
                max: {
                  value: inv + inventaris?.quantity || 0,
                  message: `Quantity tidak boleh lebih dari ${inv + inventaris?.quantity} `
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan quantity...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Aksi */}
            <FormField
              control={form.control}
              name='status'
              rules={{ required: 'Status wajib dipilih' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Aksi</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih aksi inventaris' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Sedang Maintenance'>
                        Maintenance
                      </SelectItem>
                      <SelectItem value='Digunakan'>Digunakan</SelectItem>
                      <SelectItem value='Diberikan'>Diberikan</SelectItem>
                      <SelectItem value='Rusak'>Rusak</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Harga Maintenance (hanya tampil jika status = Maintenance) */}
            {selectedStatus === 'Sedang Maintenance' && (
              <FormField
                control={form.control}
                name='hargaMaintenance'
                rules={{
                  required: 'Harga Maintenance wajib diisi'
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Maintenance</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Masukkan harga maintenance...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Keterangan */}
            <FormField
              control={form.control}
              name='keterangan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Masukkan keterangan...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tombol Submit */}
            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? 'Processing...' : isEdit ? 'Edit' : 'Simpan'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
