'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import FilterMobile from './filter-pembayaran-mobile';
import EmptyState from '../empty-state';
import Loading from '../loading';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Calendar,
  Calendar1,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  DollarSignIcon,
  Filter,
  Receipt,
  Search,
  Upload,
  Wallet,
  X
} from 'lucide-react';
import HeaderSiswa from '../header-siswa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type Tagihan = {
  id: string;
  nama: string;
  nominal: number;
  denda: number;
  jatuhTempo: string;
  status: string;
  tanggalBayar?: string;
};

type Riwayat = {
  id: string;
  nama: string;
  nominal: number;
  tanggalBayar: string;
  metode: string;
};

export default function PembayaranSiswaView() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [activeTagihan, setActiveTagihan] = useState<Tagihan | null>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tagihan' | 'riwayat'>('tagihan');
  const [showFilter, setShowFilter] = useState(false);

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      ['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)
    ) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      alert('Format file tidak valid. Gunakan JPG, JPEG, atau PNG.');
    }
  };

  // Filter state
  const [searchTagihan, setSearchTagihan] = useState('');
  const [tanggalTagihan, setTanggalTagihan] = useState('');
  const [filterStatusTagihan, setFilterStatusTagihan] = useState('');

  const [searchRiwayat, setSearchRiwayat] = useState('');
  const [tanggalRiwayat, setTanggalRiwayat] = useState('');
  const [filterStatusRiwayat, setFilterStatusRiwayat] = useState('');

  const uploadBukti = async (id: any) => {
    try {
      if (!file) return;

      setIsUploading(true);
      const fd = new FormData();
      fd.append('bukti', file);

      const upload = await api.patch(`pembayaran-upload-bukti/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Berhasil Upload Bukti');
      setOpen(false);
      setFile(null);
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ['pembayaranSiswa'] });
    } catch (error) {
      console.error('Gagal upload bukti:', error);
    } finally {
      setIsUploading(false);
      setFile(null);
      setPreview(null);

      // selesai loading
    }
  };

  // Fetch pembayaran siswa pakai react-query
  const { data: pembayaranData, isLoading } = useQuery({
    queryKey: ['pembayaranSiswa'],
    queryFn: async () => {
      const res = await api.get('pembayaran-siswa', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      const data = res?.data?.data;

      return {
        tagihan:
          data?.tagihan?.map((t: any) => ({
            id: t.id,
            nama: t.nama,
            nominal: t.nominal,
            denda: t.denda,
            jatuhTempo: new Date(t.jatuhTempo).toISOString().split('T')[0],
            status: t.status,
            tanggalBayar: t.RiwayatPembayaran?.[0]?.waktuBayar
              ? new Date(t.RiwayatPembayaran[0].waktuBayar)
                  .toISOString()
                  .split('T')[0]
              : undefined
          })) || [],
        riwayat:
          data?.riwayatPembayaran?.map((r: any) => ({
            id: r.id,
            nama: r.namaTagihan || '-',
            nominal: r?.nominal || 0,
            denda: r?.denda || 0,
            tanggalBayar: new Date(r.waktuBayar).toISOString().split('T')[0],
            metode: r.metodeBayar,
            status: r.status
          })) || []
      };
    },
    enabled: !!session?.user?.token
  });

  const tagihanData = pembayaranData?.tagihan || [];
  const riwayatData = pembayaranData?.riwayat || [];

  // Hitung summary
  const totalBelumBayar = tagihanData
    .filter(
      (t: any) => t.status === 'BELUM_BAYAR' || t.status === 'BUKTI_TIDAK_VALID'
    )
    .reduce((acc: any, t: any) => acc + t.nominal + t.denda, 0);

  // Filter data
  // Filter data
  const filteredTagihan = tagihanData.filter(
    (t: any) =>
      t.nama.toLowerCase().includes(searchTagihan.toLowerCase()) &&
      (tanggalTagihan ? t.jatuhTempo === tanggalTagihan : true) &&
      (filterStatusTagihan === 'all' || !filterStatusTagihan
        ? true
        : t.status === filterStatusTagihan)
  );

  const filteredRiwayat = riwayatData.filter(
    (r: any) =>
      r.nama.toLowerCase().includes(searchRiwayat.toLowerCase()) &&
      (tanggalRiwayat ? r.tanggalBayar === tanggalRiwayat : true) &&
      (filterStatusRiwayat === 'all' || !filterStatusRiwayat
        ? true
        : r.status === filterStatusRiwayat)
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  // Status config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'BELUM_BAYAR':
        return {
          text: 'Unpaid',
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          borderColor: 'border-red-500'
        };
      case 'PENDING':
        return {
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
          borderColor: 'border-yellow-500'
        };
      case 'LUNAS':
        return {
          text: 'Paid',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          borderColor: 'border-green-500'
        };
      case 'MENUNGGU_KONFIRMASI':
        return {
          text: 'Waiting Confirmation',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
          borderColor: 'border-yellow-500'
        };
      case 'BUKTI_TIDAK_VALID':
        return {
          text: 'Invalid Evidence',
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          borderColor: 'border-red-500'
        };
      default:
        return {
          text: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-500'
        };
    }
  };

  const BayarMidtrans = async (tagihan: any) => {
    try {
      const data = await api.post(
        `bayar-midtrans/${tagihan}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );

      if (data.status === 200) {
        router.push(data.data.snap.redirect_url);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20'>
      <HeaderSiswa
        title='Payment'
        titleContent='Total Bill'
        mainContent={formatCurrency(totalBelumBayar)}
        icon={<CreditCard className='h-7 w-7 text-white' />}
        data={[
          {
            label: 'Unpaid',
            value: tagihanData?.filter((t: any) => t.status === 'BELUM_BAYAR')
              .length,
            color: 'text-white'
          },
          {
            label: 'Pending',
            value: tagihanData?.filter((t: any) => t.status === 'PENDING')
              .length,
            color: 'text-white'
          },
          {
            label: 'Paid',
            value: riwayatData?.filter((r: any) => r.status === 'LUNAS').length,
            color: 'text-white'
          }
        ]}
      />

      {/* Tab Navigation */}
      <div className='relative z-10 mx-auto -mt-16 mb-6 max-w-6xl px-4'>
        <div className='grid grid-cols-2 gap-1 rounded-2xl bg-white p-1 shadow-lg'>
          <button
            onClick={() => setActiveTab('tagihan')}
            className={`rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'tagihan'
                ? 'scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <div className='flex items-center justify-center gap-2'>
              <Receipt className='h-5 w-5' />
              <span className='text-base md:text-xl'>Billing</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'riwayat'
                ? 'scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 active:bg-gray-100'
            }`}
          >
            <div className='flex items-center justify-center gap-2'>
              <Clock className='h-5 w-5' />
              <span className='text-base md:text-xl'>History</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className='mx-auto mb-4 max-w-6xl px-4'>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder={
                activeTab === 'tagihan'
                  ? 'Find bill...'
                  : 'Find history bill...'
              }
              value={activeTab === 'tagihan' ? searchTagihan : searchRiwayat}
              onChange={(e) =>
                activeTab === 'tagihan'
                  ? setSearchTagihan(e.target.value)
                  : setSearchRiwayat(e.target.value)
              }
              className='w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
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
          <div className='mt-3 animate-[slideDown_0.2s_ease-out] rounded-xl border border-gray-200 bg-white p-4 shadow-lg'>
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
              <Calendar1 className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='date'
                value={
                  activeTab === 'tagihan' ? tanggalTagihan : tanggalRiwayat
                }
                onChange={(e) =>
                  activeTab === 'tagihan'
                    ? setTanggalTagihan(e.target.value)
                    : setTanggalRiwayat(e.target.value)
                }
                className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none'
              />
            </div>
            <div className='mt-3'>
              <Select
                value={
                  activeTab === 'tagihan'
                    ? filterStatusTagihan
                    : filterStatusRiwayat
                }
                onValueChange={
                  activeTab === 'tagihan'
                    ? setFilterStatusTagihan
                    : setFilterStatusRiwayat
                }
              >
                <SelectTrigger className='h-12 w-full rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-blue-400'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='BELUM_BAYAR'>Unpaid</SelectItem>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='LUNAS'>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='mx-auto max-w-6xl px-4'>
        {activeTab === 'tagihan' ? (
          <div className='space-y-3'>
            {isLoading ? (
              <div className='py-12 text-center'>
                <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
                <p className='mt-4 text-gray-600'>Loading data...</p>
              </div>
            ) : filteredTagihan.length === 0 ? (
              <div className='py-12 text-center'>
                <Receipt className='mx-auto mb-4 h-16 w-16 text-gray-300' />
                <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                  Nothing Bill
                </h3>
                <p className='text-gray-500'>All bill paid</p>
              </div>
            ) : (
              filteredTagihan.map((tagihan: any) => {
                const statusConfig = getStatusConfig(tagihan.status);
                const isOverdue =
                  new Date(tagihan.jatuhTempo) < new Date() &&
                  tagihan.status === 'BELUM_BAYAR';

                return (
                  <div
                    key={tagihan.id}
                    className={`rounded-2xl border-l-4 bg-white p-5 shadow-md ${
                      isOverdue ? 'border-red-500' : statusConfig.borderColor
                    } active:scale-98 transition-transform`}
                  >
                    <div className='mb-3 flex items-start justify-between'>
                      <div className='flex-1'>
                        <h3 className='mb-1 text-base font-bold text-gray-900'>
                          {tagihan.nama}
                        </h3>
                        <p className='text-2xl font-bold text-blue-600'>
                          {formatCurrency(tagihan.nominal + tagihan.denda)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}
                      >
                        {statusConfig.text}
                      </span>
                    </div>

                    <div className='mb-4 flex items-center gap-2 text-sm text-gray-600'>
                      <Calendar className='h-4 w-4' />
                      <span>Due: {formatDate(tagihan.jatuhTempo)}</span>
                      {isOverdue && (
                        <span className='ml-2 font-semibold text-red-600'>
                          • Over due
                        </span>
                      )}
                    </div>

                    {tagihan.status === 'LUNAS' && tagihan.tanggalBayar && (
                      <div className='mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-2 text-sm text-green-600'>
                        <CheckCircle className='h-4 w-4' />
                        <span>Paid: {formatDate(tagihan.tanggalBayar)}</span>
                      </div>
                    )}

                    <>
                      {(tagihan.status === 'BELUM_BAYAR' ||
                        tagihan.status === 'BUKTI_TIDAK_VALID' ||
                        tagihan.status === 'PENDING') && (
                        <div className='flex space-x-4'>
                          {/* <button
                            onClick={() => BayarMidtrans(tagihan.id)}
                            className='flex w-[66%] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-95'
                          >
                            <span>Pay Now </span>
                            <ArrowRight className='h-5 w-5' />
                          </button> */}

                          <Button
                            onClick={() => {
                              setActiveTagihan(tagihan);
                              setOpen(true);
                            }}
                            className='h-[45px] w-[34%] space-x-4 p-4 text-sm'
                          >
                            {tagihan.status === 'BUKTI_TIDAK_VALID'
                              ? 'Reupload Evidence'
                              : 'Upload Evidence'}
                            <Camera className='ml-2' />
                          </Button>
                        </div>
                      )}

                      {/* Modal Upload */}
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className='sm:max-w-md'>
                          <DialogHeader>
                            <DialogTitle>
                              Upload Evidence {activeTagihan?.nama}
                            </DialogTitle>
                          </DialogHeader>

                          <div className='space-y-4'>
                            <input
                              type='file'
                              accept='image/png, image/jpeg, image/jpg'
                              onChange={handleFileChange}
                              className='w-full cursor-pointer rounded-md border border-gray-300 p-2'
                            />

                            {preview && (
                              <div className='mt-2 flex justify-center'>
                                <img
                                  src={preview}
                                  alt='Preview'
                                  className='h-48 w-auto rounded-lg border object-contain'
                                />
                              </div>
                            )}

                            <div className='flex justify-end space-x-2'>
                              <Button
                                variant='outline'
                                onClick={() => setOpen(false)}
                                disabled={isUploading}
                              >
                                Batal
                              </Button>

                              <Button
                                onClick={() =>
                                  activeTagihan && uploadBukti(activeTagihan.id)
                                }
                                className='flex items-center justify-center bg-blue-600 text-white'
                                disabled={isUploading}
                              >
                                {isUploading ? 'Uploading...' : 'Upload'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>

                    {tagihan.status === 'PENDING' && (
                      <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800'>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          <span className='font-medium'>
                            Waiting Confirmation
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className='space-y-3'>
            {isLoading ? (
              <div className='py-12 text-center'>
                <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
                <p className='mt-4 text-gray-600'>Loading data...</p>
              </div>
            ) : filteredRiwayat.length === 0 ? (
              <div className='py-12 text-center'>
                <Clock className='mx-auto mb-4 h-16 w-16 text-gray-300' />
                <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                  Nothing History
                </h3>
                <p className='text-gray-500'>Payment History Will Here</p>
              </div>
            ) : (
              filteredRiwayat.map((riwayat: any) => {
                const statusConfig = getStatusConfig(riwayat.status);
                console.log(riwayat);
                return (
                  <div
                    key={riwayat.id}
                    className='rounded-2xl border border-gray-200 bg-white p-5 shadow-md'
                  >
                    <div className='mb-3 flex items-start justify-between'>
                      <div className='flex-1'>
                        <h3 className='mb-1 text-base font-bold text-gray-900'>
                          {riwayat.nama}
                        </h3>
                        <p className='text-xl font-bold text-gray-700'>
                          {formatCurrency(riwayat.nominal + riwayat.denda)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}
                      >
                        {statusConfig.text}
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <span>Pay : {riwayat.tanggalBayar}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <CreditCard className='h-4 w-4' />
                        <span>Method: {riwayat.metode}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        <BottomNav />
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
