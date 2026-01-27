'use client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Trash2,
  SearchIcon,
  CalendarIcon,
  Clock,
  XCircle,
  CheckCircle2,
  FileLockIcon,
  Search,
  Filter,
  User,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DialogTitle } from '@radix-ui/react-dialog';
import MobileFilterSheet from './janji-temu-filter';
import EmptyState from '../empty-state';
import HeaderSiswa from '../header-siswa';
import { Teachers } from 'next/font/google';

type JanjiTemu = {
  id: string;
  waktu: string;
  status: string;
  deskripsi: string;
  siswaNama: string;
  siswaNis: string;
  guruNama: string;
};

type FormData = {
  deskripsi: string;
  guruId: string;
  waktu: string;
};

export default function JanjiTemuView() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [open, setOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: { deskripsi: '', guruId: '', waktu: '' }
  });

  // Fetch guru list
  // Fetch guru list
  const {
    data: guruList,
    isLoading: loadingGuru,
    error: guruError
  } = useQuery({
    queryKey: ['guruList'],
    queryFn: async () => {
      const res = await api.get('user/get-all-guru-master', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.result.data;
    },
    enabled: !!session?.user?.token
  });

  // Fetch janji temu siswa
  const {
    data: janjiTemuList,
    isLoading: loadingJanji,
    error: janjiError
  } = useQuery<JanjiTemu[]>({
    queryKey: ['janjiTemuSiswa'],
    queryFn: async () => {
      const res = await api.get('janji-temu-siswa', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  // Mutation create janji temu
  const createJanjiTemuMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setLoading(true);
      await api.post(
        'janji-temu',
        {
          idSiswa: session?.user?.idGuru,
          idGuru: data.guruId,
          waktu: data.waktu,
          status: 'menunggu',
          deskripsi: data.deskripsi
        },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Berhasil membuat janji temu');
      reset();
      setOpen(false);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['janjiTemuSiswa'] });
    },
    onError: (error: any) => {
      setLoading(false);
      toast.error(error?.response?.data?.message || 'Gagal membuat janji temu');
    }
  });

  // Mutation delete janji temu
  const deleteJanjiTemuMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoading(true);
      await api.delete(`janji-temu/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Berhasil menghapus janji temu');
      setLoading(false);

      queryClient.invalidateQueries({ queryKey: ['janjiTemuSiswa'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Gagal menghapus janji temu'
      );
      setLoading(false);
    }
  });

  const onSubmit = (data: FormData) => createJanjiTemuMutation.mutate(data);
  const handleDelete = (id: string) => deleteJanjiTemuMutation.mutate(id);
  const resetFilter = () => {
    setSearch('');
    setFilterTanggal('');
  };

  const filteredData =
    janjiTemuList
      ?.filter((item) =>
        item.deskripsi.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) => {
        if (!filterTanggal) return true;
        const dateOnly = new Date(item.waktu).toISOString().split('T')[0];
        return dateOnly === filterTanggal;
      }) || [];

  return (
    <div className='mx-auto space-y-2 pb-16'>
      <HeaderSiswa
        title='Appointment'
        titleContent='Total Appointment'
        mainContent={filteredData.length}
        icon={<FileLockIcon className='h-7 w-7 text-white' />}
        data={[
          {
            label: 'Pending',
            value: filteredData.filter((t: any) => t.status === 'menunggu')
              .length,
            color: 'text-white'
          },
          {
            label: 'Reject',
            value: filteredData.filter((t: any) => t.status === 'tolak').length,
            color: 'text-white'
          },
          {
            label: 'Approve',
            value: filteredData.filter((r: any) => r.status === 'setujui')
              .length,
            color: 'text-white'
          }
        ]}
      />{' '}
      <BottomNav />
      <div className='mx-auto max-w-6xl px-5' onClick={() => setOpen(true)}>
        <Button className='flex w-full gap-1 rounded-md bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700'>
          <Plus size={16} /> Apply Appointment
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle>Apply Appointment</DialogTitle>
          </VisuallyHidden>

          <DialogHeader>
            <Label>Form Apply Appointment</Label>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label>Description</Label>
              <Textarea
                {...register('deskripsi', { required: true })}
                placeholder='Description Appointment'
              />
            </div>
            <div>
              <Label>Guru</Label>
              <Controller
                name='guruId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <select
                    {...field}
                    className='w-full rounded border px-2 py-1'
                  >
                    <option value=''>-- Select Teacher --</option>
                    {guruList?.map((guru: any) => (
                      <option key={guru.id} value={guru.id}>
                        {guru.nama}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type='datetime-local'
                {...register('waktu', { required: true })}
              />
            </div>
            <div className='flex justify-end'>
              <Button disabled={loading} type='submit'>
                {loading ? 'Submiting' : 'Submit'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className='w-full bg-white py-4'>
        <div className='mx-auto w-full max-w-6xl px-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='w-full'>
              {/* Search & Filter */}
              <div className='mb-3 flex w-full gap-2'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Find Appointment...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                  />
                </div>

                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                    showFilter
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                >
                  <Filter className='h-5 w-5' />
                </button>
              </div>

              {/* Filter Section */}
              {showFilter && (
                <div className='mt-2 w-full animate-[slideDown_0.25s_ease-out] rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-inner backdrop-blur-sm'>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <div className='flex flex-col'>
                      <label className='mb-1 text-sm font-medium text-gray-600'>
                        Select Date
                      </label>
                      <input
                        type='date'
                        value={filterTanggal}
                        onChange={(e) => setFilterTanggal(e.target.value)}
                        className='w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      />
                    </div>

                    <div className='flex flex-col justify-end'>
                      <button
                        onClick={() => {
                          setSearch('');
                          setFilterTanggal('');
                        }}
                        className='mt-1 w-full rounded-xl bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-300 active:scale-[0.98]'
                      >
                        Reset Filter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto grid max-w-6xl grid-cols-1 gap-5 p-4 sm:grid-cols-2'>
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const statusConfig =
              item.status === 'setujui'
                ? {
                    borderColor: 'border-green-500',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                    label: 'Approved',
                    icon: <CheckCircle2 className='h-4 w-4 text-green-600' />
                  }
                : item.status === 'tolak'
                  ? {
                      borderColor: 'border-red-500',
                      bgColor: 'bg-red-100',
                      textColor: 'text-red-700',
                      label: 'Reject',
                      icon: <XCircle className='h-4 w-4 text-red-600' />
                    }
                  : {
                      borderColor: 'border-yellow-500',
                      bgColor: 'bg-yellow-100',
                      textColor: 'text-yellow-700',
                      label: 'Pending',
                      icon: <Clock className='h-4 w-4 text-yellow-600' />
                    };

            return (
              <div
                key={item.id}
                className={`rounded-2xl border-l-4 bg-white p-5 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.99] ${statusConfig.borderColor}`}
              >
                {/* Header */}
                <div className='mb-3 flex items-start justify-between'>
                  <div className='flex-1'>
                    <p className='text-xl font-bold text-gray-600'>
                      {new Date(item.waktu).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>

                {/* Deskripsi */}
                <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-gray-700'>
                  {item.deskripsi}
                </p>

                {/* Info Siswa & Guru */}
                <div className='mb-4 flex w-full items-center justify-between gap-2 text-sm text-gray-700'>
                  {/* Nama siswa */}
                  <div className='flex-shrink-0 font-medium'>
                    {item.siswaNama}
                  </div>

                  {/* Garis penghubung + ikon panah */}
                  <div className='flex w-full items-center gap-2'>
                    <div className='h-[2px] flex-1 bg-gradient-to-r from-gray-400 to-blue-500'></div>
                    <ArrowRight className='text-blue-500' size={16} />
                    <div className='h-[2px] flex-1 bg-gradient-to-r from-blue-500 to-gray-400'></div>
                  </div>

                  {/* Nama guru */}
                  <div className='flex-shrink-0 text-right font-medium'>
                    {item.guruNama}
                  </div>
                </div>

                {/* Status Detail */}
                {item.status === 'disetujui' && (
                  <div className='rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 className='h-4 w-4' />
                      <span>Appointment approved.</span>
                    </div>
                  </div>
                )}

                {item.status === 'ditolak' && (
                  <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                    <div className='flex items-center gap-2'>
                      <XCircle className='h-4 w-4' />
                      <span>Appointment rejected.</span>
                    </div>
                  </div>
                )}

                {/* Tombol Hapus */}
                {item.status === 'menunggu' && (
                  <div className='mt-4 flex justify-end'>
                    <Button
                      variant='destructive'
                      size='sm'
                      disabled={loading}
                      onClick={() => handleDelete(item.id)}
                      className='flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white shadow hover:bg-red-600'
                    >
                      <Trash2 size={14} /> {loading ? 'Removing' : 'Remove'}
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
