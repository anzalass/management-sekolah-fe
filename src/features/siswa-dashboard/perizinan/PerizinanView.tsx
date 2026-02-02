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
  ClipboardList,
  Clock,
  FileText,
  Filter,
  ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
  XCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { toast } from 'sonner';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import FilterMobile from './perizinan-filter';
import HeaderSiswa from '../header-siswa';

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
  const [showFilter, setShowFilter] = useState(false);
  const [useCustomDate, setUseCustomDate] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      keterangan: '',
      tanggal: '',
      tanggalAkhir: '',
      bukti: null as File | null
    }
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

      const tanggal = new Date(formData.tanggal);
      const tanggalAkhir = new Date(formData.tanggalAkhir);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      tanggal.setHours(0, 0, 0, 0);
      tanggalAkhir.setHours(0, 0, 0, 0);

      if (tanggal < today) {
        throw {
          response: {
            data: { message: 'Start date cannot be earlier than today' }
          }
        };
      }

      if (tanggal > tanggalAkhir) {
        throw {
          response: {
            data: { message: 'Start date cannot be later than end date' }
          }
        };
      }

      const fd = new FormData();
      fd.append('keterangan', formData.keterangan);
      fd.append('time', formData.tanggal);
      fd.append('enddate', formData.tanggalAkhir);
      if (formData.bukti?.[0]) fd.append('image', formData.bukti[0]);
      await api.post('perizinan-siswa', fd, {
        headers: {
          Authorization: `Bearer ${session.user.token}`
        }
      });
    },
    onSuccess: () => {
      toast.success('Berhasil mengajukan izin');
      queryClient.invalidateQueries({ queryKey: ['perizinan-siswa'] });
      reset();
      setOpen(false);
      setUseCustomDate(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal mengajukan izin');
      setUseCustomDate(false);
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
      setDeletingId(id);
    },
    onSuccess: () => {
      toast.success('Berhasil menghapus izin');
      queryClient.invalidateQueries({ queryKey: ['perizinan-siswa'] });
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus izin');
      setDeletingId(null);
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
    <div className='relative mx-auto mb-36 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50'>
      <div className='mx-auto w-full'>
        {/* Header + Stats */}

        <HeaderSiswa
          title='Permissions'
          titleContent='Total Submissions'
          mainContent={filteredData.length}
          icon={<ClipboardList className='h-7 w-7 text-white' />}
          data={[
            {
              label: 'Approve',
              value: filteredData.filter((i) => i.status === 'disetujui')
                .length,
              color: 'text-white'
            },
            {
              label: 'Pending',
              value: filteredData.filter((i) => i.status === 'menunggu').length,
              color: 'text-white'
            },
            {
              label: 'Reject',
              value: filteredData.filter((i) => i.status === 'ditolak').length,
              color: 'text-white'
            }
          ]}
        />

        <div className='mx-auto max-w-6xl px-2'>
          <Button
            onClick={() => setOpen(true)}
            className='group mt-3 flex h-12 w-full items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40'
          >
            <Plus
              size={18}
              className='transition-transform group-hover:rotate-90'
            />
            <span className='hidden sm:inline'>Apply Permission</span>
            <span className='sm:hidden'>Apply</span>
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          {/* Form Dialog */}
          <DialogContent className='max-w-6xl rounded-2xl'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2 text-xl'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                  <Plus className='h-5 w-5 text-blue-600' />
                </div>
                Form Apply Permission
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
              className='relative space-y-5'
            >
              {submitMutation.isPending && (
                <div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm'>
                  <div className='text-center'>
                    <Loader2 className='mx-auto h-8 w-8 animate-spin text-blue-600' />
                    <p className='mt-2 text-sm font-medium text-gray-600'>
                      Submit permission...
                    </p>
                  </div>
                </div>
              )}

              <div className='space-y-2'>
                <Label>Description</Label>
                <Textarea
                  {...register('keterangan', { required: true })}
                  placeholder='Jelaskan alasan izin Anda...'
                  className='min-h-[100px] resize-none rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div className='space-y-2'>
                <Label>{useCustomDate === true ? 'Start ' : ''}Date</Label>
                <div className='relative'>
                  <CalendarIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <Input
                    type='date'
                    {...register('tanggal', { required: true })}
                    className='rounded-xl border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
              </div>
              {useCustomDate && (
                <div className='space-y-2'>
                  <Label>End Date</Label>
                  <div className='relative'>
                    <CalendarIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                    <Input
                      type='date'
                      {...register('tanggalAkhir', { required: true })}
                      className='rounded-xl border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                </div>
              )}
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setUseCustomDate(!useCustomDate)}
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                    useCustomDate
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {useCustomDate && (
                    <CheckCircle2 className='h-4 w-4 text-white' />
                  )}
                </button>
                <span className='text-sm font-medium text-gray-700'>
                  Custom Date
                </span>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='bukti'>
                  Upload Evidence{' '}
                  <span className='text-xs text-muted-foreground'>
                    (opsional)
                  </span>
                </Label>
                <div className='group relative'>
                  <div className='flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 hover:border-blue-300 hover:bg-blue-50/50'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200'>
                      <ImageIcon className='h-5 w-5 text-blue-600' />
                    </div>
                    <div className='flex-1'>
                      <Input
                        type='file'
                        accept='image/*'
                        {...register('bukti')}
                        className='cursor-pointer border-0 bg-transparent p-0 text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-end gap-3 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setOpen(false)}
                  className='rounded-xl'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={formState.isSubmitting || submitMutation.isPending}
                  className='rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='mr-2 h-4 w-4' />
                      Apply Permission
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Search + Filter + Ajukan */}
        <div className='relative z-10 mx-auto mb-6 mt-10 max-w-6xl px-2'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-6 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Find description...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='h-12 w-full rounded-xl border border-gray-200 bg-white p-4 py-3 pl-10 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                showFilter
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600'
              }`}
            >
              <Filter className='h-5 w-5' />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className='mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg'>
              <div className='mb-3 flex items-center justify-between'>
                <h3 className='font-semibold text-gray-900'>Filter Date</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className='text-gray-400'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
              <div className='relative'>
                <CalendarIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <Input
                  type='date'
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none'
                />
              </div>
              <div className='mt-3 flex justify-end'>
                <Button
                  onClick={resetFilter}
                  variant='outline'
                  className='rounded-xl px-4'
                >
                  <XCircle className='mr-2 h-4 w-4' />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Filter */}
        {/* <div className='mb-6 sm:hidden'>
          <FilterMobile
            searchValue={search}
            setSearchValue={setSearch}
            tanggalValue={filterTanggal}
            setTanggalValue={setFilterTanggal}
          />
        </div> */}
      </div>

      {/* List izin */}
      <div className='mx-auto max-w-6xl px-2'>
        {isLoading ? (
          <div className='mx-auto flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
          </div>
        ) : filteredData.length > 0 ? (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredData.map((izin) => (
              <Card
                key={izin.id}
                className='group overflow-hidden border-0 bg-white shadow-md hover:shadow-xl'
              >
                <div
                  className={`h-1.5 w-full ${
                    izin.status === 'disetujui'
                      ? 'bg-green-500'
                      : izin.status === 'ditolak'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                  }`}
                />
                <div className='p-5'>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          izin.status === 'disetujui'
                            ? 'bg-green-100'
                            : izin.status === 'ditolak'
                              ? 'bg-red-100'
                              : 'bg-yellow-100'
                        }`}
                      >
                        <CalendarIcon
                          className={`h-5 w-5 ${
                            izin.status === 'disetujui'
                              ? 'text-green-600'
                              : izin.status === 'ditolak'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className='text-sm font-bold'>
                          {new Date(izin.time).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <div className='mt-1 flex items-center gap-1.5'>
                          {izin.status === 'disetujui' && (
                            <CheckCircle2 className='h-4 w-4 text-green-600' />
                          )}
                          {izin.status === 'ditolak' && (
                            <XCircle className='h-4 w-4 text-red-600' />
                          )}
                          {izin.status === 'menunggu' && (
                            <Clock className='h-4 w-4 text-yellow-600' />
                          )}
                          <span className='text-xs font-semibold capitalize'>
                            {izin.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='line-clamp-3 text-sm text-gray-600'>
                    {izin.keterangan}
                  </p>
                  {izin.bukti && (
                    <Dialog>
                      <VisuallyHidden>
                        <DialogTitle>Foto</DialogTitle>
                      </VisuallyHidden>
                      <DialogTrigger asChild>
                        <button className='mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100'>
                          <ImageIcon className='h-4 w-4' />
                          See Evidence
                        </button>
                      </DialogTrigger>
                      <DialogContent className='max-w-3xl rounded-2xl'>
                        <DialogHeader>
                          <DialogTitle>Permission Evidence</DialogTitle>
                        </DialogHeader>
                        <div className='overflow-hidden rounded-xl bg-gray-100'>
                          <Image
                            alt='bukti'
                            src={izin.bukti}
                            width={1200}
                            height={1200}
                            className='w-full object-contain'
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {izin.status === 'waiting' && (
                    <div className='mt-4 border-t pt-4'>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => deleteMutation.mutate(izin.id)}
                        className='w-full rounded-lg'
                        disabled={deletingId === izin.id}
                      >
                        {deletingId === izin.id ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Remove
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className='border-0 p-12 text-center shadow-sm'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
              <CalendarIcon className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='mb-2 text-lg font-semibold'>No Data</h3>
            <p className='mb-6 text-sm text-muted-foreground'>
              {search || filterTanggal
                ? 'No permissions match your filters.'
                : 'Start submitting a permission request by clicking the button above.'}
            </p>
            {(search || filterTanggal) && (
              <Button
                onClick={resetFilter}
                variant='outline'
                className='rounded-xl'
              >
                <XCircle className='mr-2 h-4 w-4' />
                Reset Filter
              </Button>
            )}
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
