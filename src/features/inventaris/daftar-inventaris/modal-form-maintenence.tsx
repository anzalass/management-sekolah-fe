'use client';

import { useState } from 'react';
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
import axios from 'axios';
import { API } from '@/lib/server';
import { Inventaris } from './daftar-inventaris-form';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function ModalFormMaintenance({
  inventaris,
  open,
  setOpen
}: {
  inventaris: Inventaris;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);
  const { toggleTrigger } = useRenderTrigger();

  const form = useForm({
    defaultValues: {
      idinventaris: inventaris.id,
      nama: inventaris.nama,
      quantity: '',
      hargaMaintenance: '',
      keterangan: '',
      status: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axios.post(`${API}pemeliharaan-inventaris/create`, data);
      setLoading(false);
      setOpen(false);
      toggleTrigger();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle>
        Form Maintenance {inventaris.nama} in {inventaris.ruang}
      </DialogTitle>
      <DialogTrigger asChild>
        <Button variant='ghost' className='w-full text-left'>
          Maintenance
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader></DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='quantity'
              rules={{
                required: 'Quantity wajib diisi',
                min: { value: 1, message: 'Quantity minimal 1' },
                max: {
                  value: inventaris.quantity,
                  message: `Quantity tidak boleh lebih dari ${inventaris.quantity}`
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

            <FormField
              control={form.control}
              name='hargaMaintenance'
              rules={{
                validate: (value) => {
                  if (form.watch('status') === 'Sedang Maintenence' && !value) {
                    return 'Harga Maintenance wajib diisi';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Maintenance</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan harga...'
                      {...field}
                      disabled={form.watch('status') === 'Non Aktif'} // Disable input jika Non Aktif
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              rules={{ required: 'Status wajib dipilih' }} // ⬅️ Tambahkan ini
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih Status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Non Aktif'>Non Aktifkan</SelectItem>
                      <SelectItem value='Sedang Maintenence'>
                        Maintenence
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />{' '}
                  {/* ⬅️ Tampilkan pesan error jika status belum dipilih */}
                </FormItem>
              )}
            />

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

            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? 'Processing...' : 'Simpan'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
