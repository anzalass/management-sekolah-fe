'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  ImageIcon,
  Plus,
  Search,
  Trash2,
  XCircle
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { toast } from 'sonner';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Izin {
  id: string;
  judul?: string;
  keterangan: string;
  time: string;
  bukti?: string | null;
  status: 'menunggu' | 'disetujui' | 'ditolak';
}

export default function Perizinan() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { keterangan: '', tanggal: '', bukti: null as File | null }
  });

  // Fetch izin
  const { data: izinList = [], isLoading } = useQuery<Izin[]>({
    queryKey: ['perizinan-siswa'],
    queryFn: async () => {
      if (!session?.user?.token) return [];
      const res = await api.get('perizinan-siswa-pribadi', {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  // Submit izin
  const submitMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!session?.user?.token) throw new Error('Token tidak ditemukan');
      const fd = new FormData();
      fd.append('keterangan', formData.keterangan);
      fd.append('time', formData.tanggal);
      if (formData.bukti?.[0]) fd.append('image', formData.bukti[0]);

      await api.post('perizinan-siswa', fd, {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Berhasil mengajukan izin');
      queryClient.invalidateQueries({ queryKey: ['perizinan-siswa'] });
      reset();
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal mengajukan izin');
    }
  });

  // Delete izin
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.token) throw new Error('Token tidak ditemukan');
      await api.delete(`perizinan-siswa/${id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
    },
    onMutate: (id: string) => {
      setDeletingId(id); // set ID yang sedang dihapus
    },
    onSuccess: () => {
      toast.success('Berhasil menghapus izin');
      queryClient.invalidateQueries({ queryKey: ['perizinan-siswa'] });
      setDeletingId(null); // reset setelah sukses
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus izin');
      setDeletingId(null); // reset kalau gagal
    }
  });
  // Filter data
  const filteredData = izinList
    .filter((izin) =>
      izin.keterangan.toLowerCase().includes(search.toLowerCase())
    )
    .filter((izin) => {
      if (!filterTanggal) return true;
      const dateOnly = new Date(izin.time).toISOString().split('T')[0];
      return dateOnly === filterTanggal;
    });

  const resetFilter = () => {
    setSearch('');
    setFilterTanggal('');
  };

  return (
    <div className='mx-auto mb-14 space-y-2'>
      <NavbarSiswa title='Perizinan Siswa' />

      {/* Button + Filter */}
      <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='flex gap-1 p-4'>
              <Plus size={16} />
              Ajukan Izin
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Form Pengajuan Izin</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
              className='space-y-4'
            >
              <div>
                <Label>Keterangan</Label>
                <Textarea
                  {...register('keterangan', { required: true })}
                  placeholder='Alasan atau penjelasan izin'
                />
              </div>

              <div>
                <Label>Tanggal</Label>
                <Input
                  type='date'
                  {...register('tanggal', { required: true })}
                />
              </div>

              <div>
                <Label htmlFor='bukti'>Upload Bukti (opsional)</Label>
                <div className='flex items-center gap-2'>
                  <ImageIcon className='h-4 w-4 text-muted-foreground' />
                  <Input type='file' accept='image/*' {...register('bukti')} />
                </div>
              </div>

              <div className='flex justify-end'>
                <Button type='submit' disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? 'Mengirim...' : 'Kirim Izin'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Cari keterangan...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='relative w-full sm:max-w-xs'>
            <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              type='date'
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button onClick={resetFilter}>Reset</Button>
        </div>
      </div>

      {/* Daftar Perizinan */}
      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {isLoading ? (
          <p className='col-span-full text-center'>Loading data...</p>
        ) : filteredData.length > 0 ? (
          filteredData.map((izin) => (
            <Card key={izin.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <p className='text-lg font-bold'>
                  {new Date(izin.time).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>

                <div className='flex items-center gap-2'>
                  {izin.status === 'disetujui' && (
                    <CheckCircle2 className='text-green-600' size={20} />
                  )}
                  {izin.status === 'ditolak' && (
                    <XCircle className='text-red-600' size={20} />
                  )}
                  {izin.status === 'menunggu' && (
                    <Clock className='text-yellow-500' size={20} />
                  )}
                  <span className='text-sm capitalize'>{izin.status}</span>
                </div>
              </div>

              <div className='mt-2 space-y-2 text-sm text-muted-foreground'>
                <p>{izin.keterangan}</p>

                {izin.bukti && (
                  <div className='mt-1'>
                    <Dialog>
                      <VisuallyHidden>
                        <DialogTitle>Bukti Foto</DialogTitle>
                      </VisuallyHidden>
                      <DialogTrigger asChild>
                        <Button variant='outline' size='sm' className='text-xs'>
                          Lihat Bukti
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-lg'>
                        <Image
                          alt='bukti'
                          src={izin.bukti}
                          width={800}
                          height={800}
                          className='w-full rounded-lg object-contain'
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              {izin.status === 'menunggu' && (
                <div className='mt-4 flex justify-end'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => deleteMutation.mutate(izin.id)}
                    className='flex items-center gap-1'
                    disabled={deletingId === izin.id}
                  >
                    <Trash2 size={16} />
                    {deletingId === izin.id ? 'Menghapus...' : 'Hapus'}
                  </Button>
                </div>
              )}
            </Card>
          ))
        ) : (
          <p className='col-span-full text-sm text-muted-foreground'>
            Tidak ada data ditemukan.
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
