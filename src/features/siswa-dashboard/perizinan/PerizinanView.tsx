'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  ImageIcon,
  Plus,
  SearchIcon,
  StepBack,
  Trash2,
  XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Izin {
  id: string;
  judul: string;
  keterangan: string;
  time: string;
  bukti?: string | null;
  status: any;
}

export default function Perizinan() {
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [izinList, setIzinList] = useState<Izin[]>([]);
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      keterangan: '',
      tanggal: '',
      bukti: null as File | null
    }
  });

  const resetFilter = () => {
    setSearch('');
    setFilterTanggal('');
  };

  // Ambil data izin dari API
  const fetchData = async () => {
    const res = await api.get('perizinan-siswa-pribadi', {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`
      }
    });
    setIzinList(res.data.data);
    console.log(res.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formData: any) => {
    try {
      const fd = new FormData();
      fd.append('keterangan', formData.keterangan);
      fd.append('time', formData.tanggal);
      if (formData.bukti?.[0]) {
        fd.append('image', formData.bukti[0]);
      }

      const res = await api.post('perizinan-siswa', fd, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      if (res.status !== 201) throw new Error('Gagal mengajukan izin');
      toast.success('Berhasil Membuat Izin');
      setOpen(false);
      fetchData();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredData = izinList
    .filter((izin) =>
      izin.keterangan.toLowerCase().includes(search.toLowerCase())
    )
    .filter((izin) => {
      if (!filterTanggal) return true;

      // konversi ISO → YYYY-MM-DD
      const dateOnly = new Date(izin.time).toISOString().split('T')[0];

      return dateOnly === filterTanggal;
    });

  const handleDelete = async (id: any) => {
    try {
      await api.delete(`perizinan-siswa/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      toast.success('Berhasil menghapus izin');
      fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className='mx-auto space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='relative flex h-[10vh] w-full items-center justify-between rounded-b-3xl bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white'>
          {/* Tombol Back */}
          <button
            onClick={() => window.history.back()}
            className='flex items-center gap-1 text-white hover:opacity-80'
          >
            <StepBack />
          </button>

          <h1 className='text-lg font-semibold'>Perizinan</h1>

          <div className='h-10 w-10 overflow-hidden rounded-full border-2 border-white'>
            <Image
              src={`https://ui-avatars.com/api/?name=${
                session?.user?.nama?.split(' ')[0]?.[0] || ''
              }+${session?.user?.nama?.split(' ')[1]?.[0] || ''}&background=random&format=png`}
              alt='Foto User'
              width={100}
              height={100}
              className='h-full w-full object-cover'
            />
          </div>
        </div>
      </div>

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
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Izin'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='relative w-full'>
            <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Cari judul atau keterangan...'
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
        {filteredData.length > 0 ? (
          filteredData.map((izin) => (
            <Card key={izin.id} className='p-4'>
              <div className='flex items-center justify-between'>
                {/* Tanggal */}
                <p className='text-lg font-bold'>
                  {new Date(izin?.time).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>

                {/* Status izin pakai icon */}
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

              {/* Tombol Delete */}
              {izin.status === 'menunggu' ? (
                <div className='mt-4 flex justify-end'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(izin.id)}
                    className='flex items-center gap-1'
                  >
                    <Trash2 size={16} />
                    Hapus
                  </Button>
                </div>
              ) : null}
            </Card>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada data ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
