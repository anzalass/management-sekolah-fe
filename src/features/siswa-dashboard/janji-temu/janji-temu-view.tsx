'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Plus,
  SearchIcon,
  StepBack,
  CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import Image from 'next/image';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';

type JanjiTemu = {
  id: string;
  waktu: Date;
  status: string;
  deskripsi: string;
  siswaNama: string;
  siswaNis: string;
  guruNama: string;
};

type FormData = {
  deskripsi: string;
  guruNama: string;
  waktu: string;
};

export default function JanjiTemuView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [janjiTemu, setJanjiTemu] = useState<JanjiTemu[]>([]);

  // Dummy list guru
  const [filterTanggal, setFilterTanggal] = useState('');

  const [guruListt, setGuruListt] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const getGuruList = async () => {
    try {
      const res = await api.get('user/get-all-guru');
      if (res.status === 200) {
        setGuruListt(res.data.result.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGuruList();
  }, []);

  const getJanjiTemu = async () => {
    try {
      const res = await api.get('janji-temu-siswa', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      if (res.status === 200) {
        setJanjiTemu(res.data.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJanjiTemu();
  }, []);

  const { register, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      deskripsi: '',
      guruNama: '',
      waktu: ''
    }
  });

  const resetFilter = () => {
    setSearch('');
    setFilterTanggal('');
  };

  const onSubmit = async (data: FormData) => {
    try {
      await api.post(
        'janji-temu',
        {
          idSiswa: session?.user?.idGuru,
          idGuru: data.guruNama,
          waktu: data.waktu,
          status: 'menunggu',
          deskripsi: data.deskripsi
        },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
      reset();
      setOpen(false); // tutup modal
      toast.success('Berhasil membuat janji temu');
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handleDelete = (id: string) => {};

  const filteredData = janjiTemu
    .filter((item: any) =>
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item: any) => {
      if (!filterTanggal) return true;

      // konversi ISO → YYYY-MM-DD
      const dateOnly = new Date(item.waktu).toISOString().split('T')[0];

      return dateOnly === filterTanggal;
    });

  return (
    <div className='mx-auto space-y-2'>
      {/* Header */}

      <NavbarSiswa title='Janji Temu' />
      <BottomNav />

      {/* Button + Search */}
      <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='flex gap-1 p-4'>
              <Plus size={16} /> Tambah Janji Temu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Form Janji Temu</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  {...register('deskripsi', { required: true })}
                  placeholder='Deskripsi janji temu'
                />
              </div>
              <div>
                <Label>Guru</Label>
                <Controller
                  name='guruNama'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className='w-full rounded border px-2 py-1'
                    >
                      <option value=''>-- Pilih Guru --</option>
                      {guruListt?.map((guru) => (
                        <option key={guru.id} value={guru.id}>
                          {guru.nama}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div>
                <Label>Waktu</Label>
                <Input
                  type='datetime-local'
                  {...register('waktu', { required: true })}
                />
              </div>
              <div className='flex justify-end'>
                <Button type='submit'>Tambahkan</Button>
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

      {/* List Janji Temu */}
      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filteredData.length > 0 ? (
          filteredData.map((item: any) => (
            <Card key={item.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <p className='text-lg font-bold'>
                  {new Date(item?.waktu).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <div className='flex items-center gap-2'>
                  {item.status === 'disetujui' && (
                    <CheckCircle2 className='text-green-600' size={20} />
                  )}
                  {item.status === 'ditolak' && (
                    <XCircle className='text-red-600' size={20} />
                  )}
                  {item.status === 'menunggu' && (
                    <Clock className='text-yellow-500' size={20} />
                  )}
                  <span className='text-sm capitalize'>{item.status}</span>
                </div>
              </div>
              <div className='mt-2 space-y-2 text-sm text-muted-foreground'>
                <p>{item.deskripsi}</p>
                <p>
                  <span className='font-medium'>Siswa: </span>
                  {item.siswaNama} ({item.siswaNis})
                </p>
                <p>
                  <span className='font-medium'>Guru: </span>
                  {item.guruNama}
                </p>
              </div>
              {item.status === 'menunggu' && (
                <div className='mt-4 flex justify-end'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(item.id)}
                    className='flex items-center gap-1'
                  >
                    <Trash2 size={16} /> Hapus
                  </Button>
                </div>
              )}
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
